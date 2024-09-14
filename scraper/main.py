import json
import requests

COOKIES = {
    "registration.es.cloud.vt.edu": "ce9b83507494353",
    "IDMSESSID": "1D1780A6D6424DAC669FE4819FC79C64F3E6E078FF9EC37A88ABB2FA5A6369887ABC42BEF65C91CB75611868D656B3A3BF643777E882E2E84406C73B47381117",
    "JSESSIONID": "8C9D8A50C5B0CE58159D5DCC386EC533",
}


def add_class_to_pending(crn):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/addCRNRegistrationItems"

    form_data = {"crnList": str(crn), "term": "202412"}

    r = requests.post(url, cookies=COOKIES, data=form_data)

    print(r.status_code)
    print(r.json())


def get_add_classes():
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    r = requests.get(url, cookies=COOKIES)
    print(r.json())
    print(r.status_code)


def get_drop_classes(crn):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    r = requests.get(url, cookies=COOKIES)
    print(r.status_code)
    print(r.content)
    response = r.json()
    data = response["data"]["update"]
    id = ""
    for course in data:
        if course["courseReferenceNumber"] == str(crn):
            id = course["id"]
            break

    return id


def form_drop_payload(id):
    with open("drop.json", "r") as f:
        payload = json.load(f)
        payload["update"][0]["id"] = int(id)
        print(payload)

    return payload


def drop_class(crn):
    url = "https://registration.es.cloud.vt.edu/StudentRegistrationSsb/ssb/classRegistration/submitRegistration/batch"

    id = get_drop_classes(crn)
    payload = form_drop_payload(id)

    r = requests.post(url, json=payload, cookies=COOKIES)
    print(r.json())
    print(r.status_code)


if __name__ == "__main__":
    # add_class_to_pending()
    # get_add_classes()

    drop_class(40026)
