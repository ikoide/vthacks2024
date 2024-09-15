from flask_restx import Model
from flask_restx.fields import String, DateTime, Nested

swap_model = Model(
    "Swap",
    {
        "swapped_on": DateTime,
        "created_on": DateTime,
        "status": String,
    },
)


def get_swap_model():
    from vt.apis.users.dto import user_model

    return swap_model.clone(
        "SwapGet",
        {"user_1": Nested(user_model), "user_2": Nested(user_model)},
    )
