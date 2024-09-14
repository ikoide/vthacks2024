from flask_restx import Namespace, Resource

from vt.apis.courses.dto import course_model

courses_ns = Namespace(name="courses", validate=True)
courses_ns.models[course_model.name] = course_model
