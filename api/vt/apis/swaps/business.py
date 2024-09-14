from vt.core.models.swap import Swap
from vt.util.make_request import to_serializable


def get_swaps():
    swaps = Swap.objects.all()
    swaps_dict = [to_serializable(swap) for swap in swaps]

    return swaps_dict
