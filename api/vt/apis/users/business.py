from bson.json_util import dumps
import json
import requests

from flask import current_app

from mongoengine.queryset.visitor import Q

from vt.core.models.user import User
from vt.util.make_request import to_serializable
from vt.apis.swaps.tasks import match_user_in_cycles


def create_user(data):
    user = User(**data)
    user.save()

    return json.loads(dumps(user.to_mongo()))


## Dev route
def delete_users():
    users = User.objects().all()
    for user in users:
        user.delete()

    return None


def update_user(user, data):
    try:
        for key, value in data.items():
            if hasattr(user, key):
                setattr(user, key, value)

        user.save()

    except Exception as e:
        return {"error": e}

    return user


def get_user(id):
    user = User.find_by_id(id)
    if not user:
        pass

    return user


def delete_user(id):
    user = User.find_by_id(id)
    if not user:
        pass

    user.delete()

    return None


def get_users(filters):
    query = {}
    if filters["email"]:
        query["email"] = filters["email"]

    users = User.objects(**query).all()
    users_dict = []
    for user in users:
        user_dict = json.loads(dumps(user.to_mongo()))
        user_dict.pop("password", None)
        users_dict.append(user_dict)

    return users_dict


def login_user(email, data):
    user = User.objects(Q(email=email) & Q(password=data["password"])).first()
    if user:
        return str(user.sess_id)
    else:
        return None


def scan_user(user):
    swaps = match_user_in_cycles(user)
    swaps_dict = []
    for swap in swaps:
        swap_dict = json.loads(dumps(swap.to_mongo()))
        # Serialize each user in the 'user' list
        users_list = []
        for user_ref in swap.users:
            user_dict = json.loads(dumps(user_ref.to_mongo()))
            users_list.append(user_dict)
        # Replace the 'user' field with the list of serialized user dictionaries
        swap_dict.pop("users")
        swap_dict["users"] = users_list
        swaps_dict.append(swap_dict)

    if len(swaps_dict) > 0:
        url = "http://172.31.88.165:8000/receive_trade_init"
        r = requests.post(url, json=swaps_dict[0])

    return swaps_dict
