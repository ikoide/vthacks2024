from flask_restx import Model
from flask_restx.fields import String

course_model = Model("Course", {"name": String})
