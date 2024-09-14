from flask_restx import Api

from vt.apis.users.endpoints import users_ns
from vt.apis.courses.endpoints import courses_ns

api = Api(
    title="VTHacks API",
    version="0.0",
    description="Back-end API for VTHacks.",
    doc="/docs",
)

api.add_namespace(courses_ns, path="/courses")
api.add_namespace(users_ns, path="/users")
