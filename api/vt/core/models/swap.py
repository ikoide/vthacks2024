from datetime import datetime

from mongoengine import (
    Document,
    StringField,
    ListField,
    ReferenceField,
    DateTimeField,
    CASCADE,
)


class Swap(Document):
    users = ListField(ReferenceField("User", reverse_delete_rule=CASCADE))
    items = ListField(StringField())
    status = StringField(default="pending")
    created_on = DateTimeField(default=datetime.utcnow)
    swapped_on = DateTimeField()

    @classmethod
    def find_by_id(cls, id):
        return cls.objects(id=id).first()
