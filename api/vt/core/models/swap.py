from datetime import datetime

from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField


class Swap(Document):
    created_on = DateTimeField(default=datetime.utcnow)
    swapped_on = DateTimeField()

    user_1 = ReferenceField("User", required=True)
    user_2 = ReferenceField("User", required=True)

    user_1_course = ReferenceField("Course", required=True)
    user_2_course = ReferenceField("Course", required=True)
