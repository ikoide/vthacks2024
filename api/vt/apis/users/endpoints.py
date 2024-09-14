from flask_restx import Namespace, Resource

from vt.apis.users.business import get_users

users_ns = Namespace(name="users")


@users_ns.route("", endpoint="users_all")
class GetUsers(Resource):
    def get(self):
        """Return all users."""

        return get_users
