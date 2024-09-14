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
    created_on = DateTimeField(default=datetime.utcnow)
    swapped_on = DateTimeField()
