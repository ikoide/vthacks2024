import os

from flask import Flask


def create_app(config_filename="flask.cfg"):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile(config_filename)

    return app
