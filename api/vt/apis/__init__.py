from flask_restx import Api

from vt.apis.auth.endpoints import auth_ns

api = Api(
    title="VTHacks API",
    version="0.0",
    description="Back-end API for VTHacks.",
    doc="/docs",
)

api.add_namespace(auth_ns, path="/auth")
