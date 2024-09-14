from bson.json_util import dumps
import json

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


def get_users(filters):
    query = {}
    if filters["email"]:
        query["email"] = filters["email"]

    users = User.objects(**query).all()
    users_dict = []
    for user in users:
        user_dict = json.loads(dumps(user.to_mongo()))
        users_dict.append(user_dict)

    return users_dict
