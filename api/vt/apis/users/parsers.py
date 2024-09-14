from flask_restx import reqparse


def create_user_parser():
    parser = reqparse.RequestParser()
    parser.add_argument("email", type=str, help="Filter users by email")

    return parser


user_parser = create_user_parser()
