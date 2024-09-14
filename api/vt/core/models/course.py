import mongoengine import Document, StringField

class Course(Document):
    name = StringField(required=True)
    cid = StringField(required=True)
