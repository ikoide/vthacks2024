from flask_restx import Namespace, Resource

from vt.apis.swaps.business import get_swaps, execute_swap
from vt.apis.swaps.dto import swap_model

swaps_ns = Namespace(name="swaps")
swaps_ns.models[swap_model.name] = swap_model


@swaps_ns.route("", endpoint="swaps_all")
class GetSwaps(Resource):
    def get(self):
        return get_swaps()


@swaps_ns.route("/<string:id>/ready", endpoint="swaps_ready")
class SwapReady(Resource):
    def post(self, id):
        return execute_swap(swaps_ns.payload)
