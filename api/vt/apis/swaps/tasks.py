from mongoengine import (
    Document,
    StringField,
    ListField,
    FloatField,
    ReferenceField,
    CASCADE,
)
from collections import defaultdict
import requests

from flask import current_app

from vt.core.models.user import User
from vt.core.models.swap import Swap


def match_user_in_cycles(target_user_id, max_cycle_length=3):
    current_app.logger.info(target_user_id)
    # Step 1: Retrieve all users from the database
    users = list(User.objects())

    # Initialize data structures
    graph = defaultdict(list)  # user_id -> list of neighbor user_ids
    user_has = defaultdict(set)  # item -> set of user_ids who have it
    user_wants = defaultdict(set)  # item -> set of user_ids who want it
    priority_scores = {}  # user_id -> priority_score
    user_data = {}  # user_id -> User object

    user_ids = set()
    for user in users:
        user_id = user.sess_id
        user_ids.add(user_id)
        priority_scores[user_id] = user.priority_score
        user_data[user_id] = user  # Map user_id to User object

        for item in user.courses_to_drop:
            user_has[item].add(user_id)

        for item in user.courses_to_add:
            user_wants[item].add(user_id)

    # **Initialize swaps list to collect swaps involving the target user**
    swaps = []

    # Build edges based on has/wants
    for item in user_has:
        has_users = user_has[item]
        wants_users = user_wants.get(item, set())
        for has_user in has_users:
            for wants_user in wants_users:
                if has_user != wants_user:
                    graph[has_user].append(wants_user)

    current_app.logger.info(f"user_has: {dict(user_has)}")
    current_app.logger.info(f"user_wants: {dict(user_wants)}")

    # Step 2: Find all simple cycles involving the target user up to max_cycle_length
    cycles = []
    target_user = target_user_id

    def dfs(path, visited, depth):
        current_node = path[-1]
        if depth > max_cycle_length:
            return
        for neighbor in graph[current_node]:
            if neighbor == target_user and depth > 1:
                # Found a cycle involving the target user
                cycles.append(list(path))
            elif neighbor not in visited:
                visited.add(neighbor)
                path.append(neighbor)
                dfs(path, visited, depth + 1)
                path.pop()
                visited.remove(neighbor)

    dfs([target_user], set([target_user]), depth=1)

    # Remove duplicate cycles
    unique_cycles = []
    seen_cycles = set()
    for cycle in cycles:
        # Normalize the cycle representation
        rotated_cycle = (
            cycle[cycle.index(target_user) :] + cycle[: cycle.index(target_user)]
        )
        normalized_cycle = tuple(rotated_cycle)
        if normalized_cycle not in seen_cycles:
            seen_cycles.add(normalized_cycle)
            unique_cycles.append(cycle)

    # Step 3: Assign weights to cycles
    cycle_weights = []
    for cycle in unique_cycles:
        # Calculate the total priority score for the cycle
        total_priority = sum(priority_scores[user_id] for user_id in cycle)
        cycle_weights.append((total_priority, cycle))

    # Step 4: Select cycles involving the target user and create Swaps
    # Sort cycles by total priority score in descending order
    cycle_weights.sort(reverse=True)

    matched_users = set()

    for _, cycle in cycle_weights:
        # Allow the target user to be in multiple swaps but prevent others from being in multiple swaps
        if not any(
            user_id in matched_users for user_id in cycle if user_id != target_user
        ):
            # Build the list of items being swapped
            items = []
            valid_cycle = True
            for i in range(len(cycle)):
                giver_id = cycle[i]
                receiver_id = cycle[(i + 1) % len(cycle)]
                giver = user_data[giver_id]
                receiver = user_data[receiver_id]
                giver_has = set(giver.courses_to_drop)
                receiver_wants = set(receiver.courses_to_add)
                common_items = giver_has & receiver_wants
                if common_items:
                    item = common_items.pop()
                    items.append(item)
                else:
                    # No common item, invalid cycle
                    valid_cycle = False
                    break
            if valid_cycle:
                # Create Swap object
                swap_users = [user_data[user_id] for user_id in cycle]
                swap = Swap(users=swap_users, items=items)
                current_app.logger.info(swap)
                swap.save()

                # Call notify_users_email with users' emails
                # notify_users_email([user.email for user in swap_users])

                # Update matched users (excluding the target user)
                matched_users.update(
                    user_id for user_id in cycle if user_id != target_user
                )

                # Update user documents to reflect participation in a swap
                for i in range(len(cycle)):
                    user = user_data[cycle[i]]
                    item_dropped = items[i]
                    item_received = items[i - 1]  # Item received from the previous user

                    # Remove item_dropped from courses_to_drop
                    if item_dropped in user.courses_to_drop:
                        user.courses_to_drop.remove(item_dropped)

                    # Remove item_received from courses_to_add
                    if item_received in user.courses_to_add:
                        user.courses_to_add.remove(item_received)

                    user.save()

                    # **Update user_has and user_wants dictionaries**
                    user_has[item_dropped].discard(user.sess_id)
                    user_wants[item_received].discard(user.sess_id)

                # **Append swap to the swaps list**
                current_app.logger.info(swap)
                swaps.append(swap)
            else:
                # Invalid cycle, skip
                continue

    if swaps:
        print(f"{len(swaps)} swap(s) involving user {target_user_id} created.")
    else:
        print(f"No swap cycles found involving user {target_user_id}")

    # **Return the list of swaps involving the target user**
    return swaps


def notify_users_email(recipients):
    for email in recipients:
        payload = {
            "sender": {"email": "mail@hokieswap.com", "name": "HokieSWAP"},
            "to": [{"email": email}],
            "subject": "You have a new swap available!",
            "htmlContent": "<a href='#'>Accept</a><br><a href='#'>Deny</a>",
        }
        send_email(payload)


def send_email(payload):
    url = "https://api.sendinblue.com/v3/smtp/email"
    headers = {
        "accept": "application/json",
        "api-key": "YOUR_API_KEY_HERE",
        "content-type": "application/json",
    }
    # Send email with requests
    resp = requests.post(url, headers=headers, json=payload)
    print(resp)
    print(resp.text)
    # Handle response as needed

