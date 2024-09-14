from vt.core.models.user import User
from vt.util.make_request import to_serializable


def create_user(data):
    user = User(**data)
    user.save()


def update_user(user, data):
    try:
        for key, value in data.items():
            if hasattr(user, key):
                attr_value = getattr(user, key)

                if attr_value != value:
                    new_value = type(attr_value)(value)
                    setattr(user, key, new_value)

        user.save()

    except Exception as e:
        return {"error": e}

    return user


def get_user(id):
    user = User.find_by_id(id)
    if not user:
        pass

    return user


def delete_user(id):
    user = User.find_by_id(id)
    if not user:
        pass

    user.delete()

    return None


def get_users():
    users = User.objects.all()
    users_dict = [to_serializable(user) for user in users]

    return users_dict
