from flask_restx import Model
from flask_restx.fields import String, Nested, List

user_model = Model(
    "User",
    {
        "email": String,
        "first_name": String,
        "last_name": String,
        "profile_picture": String,
    },
)


def get_user_model():
    user_model["courses_to_add"] = List(Nested(user_model))

    return user_model


def post_user_model():
    return user_model
