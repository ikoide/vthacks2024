from flask_restx import Model
from flask_restx.fields import String, List

user_model = Model(
    "User",
    {"email": String, "name": String, "password": String},
)


def get_user_model():
    return user_model.clone(
        "UserGet",
        {"courses_to_add": List(String), "courses_to_drop": List(String)},
    )


def post_user_model():
    return user_model.clone("UserPost")
