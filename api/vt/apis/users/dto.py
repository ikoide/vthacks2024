from flask_restx import Model
from flask_restx.fields import String, List, Float

user_model = Model(
    "User",
    {
        "priority_score": Float,
        "email": String,
        "name": String,
        "password": String,
    },
)


def get_user_model():
    return user_model.clone(
        "UserGet",
        {
            "sess_id": String,
            "priority_score": Float,
            "courses_to_add": List(String),
            "courses_to_drop": List(String),
        },
    )


def post_user_model():
    return user_model.clone("UserPost")
