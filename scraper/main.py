import json
import requests

COOKIES = {
    "IDMSESSID": "F0B828E826E8951AA45096CD4E10D1E2C9A873F0AA9AC38D18CF3DEB8B1E05B0714CF881B188C654C7DF229F3BE9D782E68A282B5EC0649FAF7D7611DF38AF80",
    "registration.es.cloud.vt.edu": "f852f8d8e726a10e",
    "JSESSIONID": "E29D983CAE4FB5FFE86C824674A43E39",
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
    # print(r.json())
    print(r.status_code)


if __name__ == "__main__":
    add_class_to_pending(40007)
    get_add_classes()

    drop_class(40007)
