import json

from flask import current_app

from vt.core.models.swap import Swap
from vt.util.make_request import to_serializable
from vt.apis.swaps.api import add_class, drop_class


def get_swaps():
    swaps = Swap.objects.all()
    swaps_dict = [to_serializable(swap) for swap in swaps]

    return swaps_dict


def execute_swap(data):
    for user in data:
        cookies = user["cookies"]
        drop_class(user["drop"], cookies)
        add_class(user["add"], cookies)
