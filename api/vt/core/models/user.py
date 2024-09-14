from mongoengine import Document, StringField, ListField, ReferenceField


class User(Document):
    email = StringField(required=True, unique=True)
    password = StringField(required=True)

    courses_to_add = ListField(ReferenceField("Course"))
    courses_to_drop = ListField(ReferenceField("Course"))

    @classmethod
    def find_by_id(cls, id):
        return cls.objects(id=id).first()

    def __repr__(self):
        return f"<User email={self.email}>"
