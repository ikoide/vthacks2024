from flask_restx import Namespace, Resource

auth_ns = Namespace(name="auth", validate=True)


@auth_ns.route("/login", endpoint="auth_login")
class LoginUser(Resource):
    """Login route"""

    def get(self):
        return {"message": "Hello, World!"}
