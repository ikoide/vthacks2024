from flask_restx import Api

from vt.apis.users.endpoints import users_ns
from vt.apis.swaps.endpoints import swaps_ns

api = Api(
    title="HokieSwap API",
    version="0.0",
    description="Back-end API for VTHacks.",
    doc="/docs",
)

api.add_namespace(users_ns, path="/users")
api.add_namespace(swaps_ns, path="/swaps")
