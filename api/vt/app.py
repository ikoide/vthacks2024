import os

from flask import Flask
from werkzeug.exceptions import HTTPVersionNotSupported

from mongoengine import connect

from vt.extensions import cors
from vt.apis import api


def create_app(config_filename="flask.cfg"):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_filename)

    initialize_database(app)
    initialize_extensions(app)

    return app


def initialize_extensions(app):
    api.init_app(app)
    cors.init_app(app)

    return None


def initialize_database(app):
    connect(
        host="mongodb://"
        + app.config["MONGODB_HOST"]
        + ":"
        + app.config["MONGODB_PORT"]
        + "/"
        + app.config["MONGODB_DB"]
    )
