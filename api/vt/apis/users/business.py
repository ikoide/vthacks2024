from vt.core.models.user import User
from vt.util.make_request import to_serializable


def get_users():
    users = User.objects.all()
    users_dict = [to_serializable(user) for user in users]

    return users_dict
