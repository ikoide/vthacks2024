import uuid
from mongoengine import Document, StringField, ListField, FloatField


class User(Document):
    sess_id = StringField(default=lambda: str(uuid.uuid4()), required=True, unique=True)
    name = StringField(required=True)
    priority_score = FloatField(default=0.5)

    email = StringField(required=True, unique=True)
    password = StringField(required=True)

    courses_to_add = ListField(StringField())
    courses_to_drop = ListField(StringField())

    @classmethod
    def find_by_id(cls, id):
        return cls.objects(sess_id=id).first()

    @classmethod
    def find_by_email(cls, email):
        return cls.objects(email=email).first()

    def __repr__(self):
        return f"<User email={self.email}>"
