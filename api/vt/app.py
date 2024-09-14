import os
import logging
from logging.handlers import RotatingFileHandler

from flask import Flask
from werkzeug.exceptions import HTTPVersionNotSupported

from mongoengine import connect

from vt.extensions import cors
from vt.apis import api


def create_app(config_filename="flask.cfg"):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_filename)

    initialize_database(app)
    initialize_logging(app)
    initialize_extensions(app)

    return app


def initialize_extensions(app):
    api.init_app(app)
    cors.init_app(app)

    return None


def initialize_logging(app):
    if not app.debug:
        if not os.path.exists("logs"):
            os.mkdir("logs")

        handler = RotatingFileHandler(
            "logs/sleipnir.log", maxBytes=10240, backupCount=10
        )
        handler.setFormatter(
            logging.Formatter(
                "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
            )
        )
        handler.setLevel(logging.INFO)
        app.logger.addHandler(handler)

    else:
        app.logger.setLevel(logging.DEBUG)
        handler = logging.StreamHandler()
        handler.setLevel(logging.DEBUG)
        app.logger.addHandler(handler)


def initialize_database(app):
    connect(
        host="mongodb://"
        + app.config["MONGODB_HOST"]
        + ":"
        + app.config["MONGODB_PORT"]
        + "/"
        + app.config["MONGODB_DB"]
    )
