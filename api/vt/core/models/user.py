from mongoengine import Document, StringField, ListField, ReferenceField


class User(Document):
    email = StringField(required=True, unique=True)
    first_name = StringField(required=True)
    last_name = StringField(required=True)
    profile_picture = StringField(required=True)

    courses_to_add = ListField(ReferenceField("Course"))
    courses_to_drop = ListField(ReferenceField("Course"))

    def __repr__(self):
        return f"<User email={self.email}>"
