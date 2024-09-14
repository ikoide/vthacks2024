from flask_restx import Api

from vt.apis.auth.endpoints import auth_ns
from vt.apis.users.endpoints import users_ns

api = Api(
    title="VTHacks API",
    version="0.0",
    description="Back-end API for VTHacks.",
    doc="/docs",
)

api.add_namespace(auth_ns, path="/auth")
api.add_namespace(users_ns, path="/users")
