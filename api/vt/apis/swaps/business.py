import json

from flask import current_app

from vt.core.models.swap import Swap
from vt.util.make_request import to_serializable
from vt.apis.swaps.api import add_class, drop_class


def get_swaps():
    swaps = Swap.objects.all()
    swaps_dict = [to_serializable(swap) for swap in swaps]

    return swaps_dict


def strip_cookies(cookies_data):
    """
    Extracts specific cookies and returns a simplified dictionary.

    Args:
        cookies_data (list): A list of cookie dictionaries.

    Returns:
        dict: A dictionary containing only the specified cookies and their values.
    """
    # Define the cookie names to extract
    keys_to_extract = {
        "IDMSESSID": "IDMSESSID",
        "JSESSIONID": "JSESSIONID",  # Mapping to desired key name if different
        "registration.es.cloud.vt.edu": "registration.es.cloud.vt.edu",
    }

    # Initialize the stripped dictionary
    stripped_dict = {}

    # Iterate through each cookie in the list
    for cookie in cookies_data:
        name = cookie.get("name")
        if name in keys_to_extract:
            # Get the desired key name (with dot if needed)
            key = keys_to_extract[name]
            stripped_dict[key] = cookie.get("value")

    current_app.logger.info(stripped_dict)
    return stripped_dict


def execute_swap(data):
    for key, value in data.items():
        cookies = strip_cookies(json.loads(value["cookies"]))
        current_app.logger.info(value["add"])
        current_app.logger.info(value["drop"])
        drop_class(value["drop"], cookies)
        add_class(value["add"], cookies)
