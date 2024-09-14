from flask_restx import Namespace, Resource

from vt.apis.users.business import (
    get_users,
    create_user,
    get_user,
    update_user,
    delete_user,
)
from vt.apis.users.dto import user_model, get_user_model, post_user_model
from vt.apis.users.parsers import user_parser

users_ns = Namespace(name="users")
users_ns.models[user_model.name] = user_model
users_ns.models[get_user_model().name] = get_user_model()
users_ns.models[post_user_model().name] = post_user_model()


@users_ns.route("", endpoint="users_all")
class GetUsers(Resource):
    @users_ns.expect(user_parser, validate=True)
    def get(self):
        """Return all users."""
        args = user_parser.parse_args()

        return get_users(args)


@users_ns.route("/new", endpoint="users_new")
class UserPost(Resource):
    @users_ns.expect(post_user_model(), validate=False)
    @users_ns.marshal_with(post_user_model())
    def post(self):
        return create_user(users_ns.payload)


@users_ns.route("/<string:id>", endpoint="users_user")
class User(Resource):
    def get(self, id):
        return users_ns.marshal(get_user(id), get_user_model())

    @users_ns.expect(get_user_model(), validate=False)
    @users_ns.marshal_with(get_user_model())
    def patch(self, id):
        user = get_user(id)

        result = update_user(user, users_ns.payload)

        return result

    @users_ns.marshal_with(get_user_model())
    def delete(self, id):
        user = get_user(id)
        return delete_user(user)
