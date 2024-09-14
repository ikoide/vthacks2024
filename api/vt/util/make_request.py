from bson.json_util import dumps
import json


def to_serializable(ad):
    return json.loads(dumps(ad.to_mongo()))
