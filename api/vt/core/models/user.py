from mongoengine import Document, StringField


class User(Document):
    email = StringField(required=True, unique=True)
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    profile_picture = StringField(required=True)
