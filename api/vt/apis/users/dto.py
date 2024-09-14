from flask_restx import Model
from flask_restx.fields import String, Nested, List

user_model = Model(
    "User",
    {"email": String, "password": String},
)


def get_user_model():
    from vt.apis.courses.dto import course_model

    return user_model.clone(
        "UserGet", {"courses_to_add": Nested(course_model, required=True)}
    )


def post_user_model():
    return user_model.clone("UserPost")
