from mongoengine import Document, StringField, ListField


class User(Document):
    email = StringField(required=True, unique=True)
    name = StringField(required=True)
    password = StringField(required=True)

    courses_to_add = ListField(StringField())
    courses_to_drop = ListField(StringField())

    @classmethod
    def find_by_id(cls, id):
        return cls.objects(id=id).first()

    def __repr__(self):
        return f"<User email={self.email}>"
