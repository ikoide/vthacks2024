import json
import requests
import os

from flask import current_app


def add_class_to_pending(crn, cookies):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/addCRNRegistrationItems"

    form_data = {"crnList": str(crn), "term": "202412"}

    r = requests.post(url, cookies=cookies, data=form_data)


def get_add_classes(cookies):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    r = requests.get(url, cookies=cookies)


def get_drop_classes(crn, cookies):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    r = requests.get(url, cookies=cookies)
    current_app.logger.info("Cookies: " + str(cookies))
    current_app.logger.info(crn)
    current_app.logger.info(r.content)
    response = r.json()
    data = response["data"]["update"]
    id = ""
    for course in data:
        if course["courseReferenceNumber"] == str(crn):
            id = course["id"]
            break

    return id


def form_drop_payload(id):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "drop.json")
    current_app.logger.info(json_path)

    with open(json_path, "r") as f:
        payload = json.load(f)
        current_app.logger.info(payload)
        payload["update"][0]["id"] = int(id)

    return payload


def drop_class(crn, cookies):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    id = get_drop_classes(crn, cookies)
    payload = form_drop_payload(id)

    r = requests.post(url, json=payload, cookies=cookies)


def add_class(crn, cookies):
    add_class_to_pending(crn, cookies)
    get_add_classes(cookies)
