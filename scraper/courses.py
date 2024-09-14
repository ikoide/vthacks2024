import requests
import collections

if not hasattr(collections, "Callable"):
    import collections.abc

    collections.Callable = collections.abc.Callable

from bs4 import BeautifulSoup

url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest"
form_data = {
    "CAMPUS": "0",
    "TERMYEAR": "202412",
    "CORE_CODE": "AR%",
    "subj_code": "%",
    "SCHDTYPE": "%",
    "CRSE_NUMBER": "",
    "crn": "",
    "open_only": "",
    "sess_code": "%",
    "BTN_PRESSED": "FIND+class+sections",
    "inst_name": "",
}

r = requests.post(url, data=form_data)
html = r.content

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table")
rows = table.find_all("tr")
#
# Skip the header row and iterate over the remaining rows
for row in rows[1:]:
    cells = row.find_all("td")
    if len(cells) >= 9:
        # Extract CRN
        crn_cell = cells[0]
        crn = (
            crn_cell.find("b").get_text(strip=True)
            if crn_cell.find("b")
            else crn_cell.get_text(strip=True)
        )

        # Extract Course
        course = cells[1].get_text(strip=True)

        # Extract Title
        title = cells[2].get_text(strip=True)

        # Extract Schedule Type
        schedule_type = cells[3].get_text(strip=True)

        # Extract Modality
        modality = cells[4].get_text(strip=True)

        # Extract Cr Hrs
        cr_hrs = cells[5].get_text(strip=True)

        # Extract Seats
        seats_cell = cells[6]
        seats = (
            seats_cell.find("b").get_text(strip=True)
            if seats_cell.find("b")
            else seats_cell.get_text(strip=True)
        )

        # Extract Capacity
        capacity = cells[7].get_text(strip=True)

        # Extract Instructor
        instructor = cells[8].get_text(strip=True)

        # Store the extracted data
        data.append(
            {
                "CRN": crn,
                "Course": course,
                "Title": title,
                "Schedule Type": schedule_type,
                "Modality": modality,
                "Cr Hrs": cr_hrs,
                "Seats": seats,
                "Capacity": capacity,
                "Instructor": instructor,
            }
        )

# Print the extracted data
for entry in data:
    print(
        f"CRN: {entry['CRN']}, Course: {entry['Course']}, Title: {entry['Title']}, "
        f"Schedule Type: {entry['Schedule Type']}, Modality: {entry['Modality']}, "
        f"Cr Hrs: {entry['Cr Hrs']}, Seats: {entry['Seats']}, "
        f"Capacity: {entry['Capacity']}, Instructor: {entry['Instructor']}"
    )
