# ==========================================================
# PATIENT CARE ROUTES
# AI SMART PHARMACY
# ==========================================================

from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from datetime import datetime

from utils.auth import login_required

from utils.data_loader import load_patients_data


# ==========================================================
# BLUEPRINT
# ==========================================================

patients_bp = Blueprint(
    "patients",
    __name__,
    url_prefix="/patients"
)


# ==========================================================
# DEMO PATIENT DATA
# ==========================================================

# ==========================================================
# CALCULATE AGE
# ==========================================================

def calculate_age(date_of_birth):

    try:

        birth_date = datetime.strptime(
            date_of_birth,
            "%Y-%m-%d"
        ).date()

        today = datetime.today().date()

        age = (
            today.year -
            birth_date.year
        )

        if (
            today.month,
            today.day
        ) < (
            birth_date.month,
            birth_date.day
        ):

            age -= 1

        return age

    except (
        ValueError,
        TypeError
    ):

        return 0




# ==========================================================
# PATIENT CARE PAGE
# ==========================================================

@patients_bp.route("/")
@login_required
def patients():

    # ------------------------------------------------------
    # PAGINATION
    # ------------------------------------------------------

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = 10


    # ------------------------------------------------------
    # LOAD ALL PATIENTS FROM CSV
    # ------------------------------------------------------

    patient_df = load_patients_data()


    # ------------------------------------------------------
    # CONVERT DATAFRAME TO DICTIONARIES
    # ------------------------------------------------------

    all_patients = []


    if patient_df is not None and not patient_df.empty:

        patient_df = patient_df.fillna("")


        for row in patient_df.to_dict(
            orient="records"
        ):

            # ----------------------------------------------
            # Support common CSV column names
            # ----------------------------------------------

            patient_id = (
                row.get("Patient_ID")
                or row.get("patient_id")
                or row.get("ID")
                or row.get("id")
                or ""
            )


            first_name = (
                row.get("First_Name")
                or row.get("first_name")
                or ""
            )


            last_name = (
                row.get("Last_Name")
                or row.get("last_name")
                or ""
            )


            name = (
                row.get("Name")
                or row.get("Patient_Name")
                or row.get("name")
                or ""
            )


            # If Name is empty, build it
            if not name:

                name = (
                    f"{first_name} "
                    f"{last_name}"
                ).strip()


            date_of_birth = (
                row.get("Date_of_Birth")
                or row.get("date_of_birth")
                or row.get("DOB")
                or ""
            )


            gender = (
                row.get("Gender")
                or row.get("gender")
                or ""
            )


            phone = (
                row.get("Phone")
                or row.get("Phone_Number")
                or row.get("phone")
                or ""
            )


            email = (
                row.get("Email")
                or row.get("email")
                or ""
            )


            blood_group = (
                row.get("Blood_Group")
                or row.get("blood_group")
                or ""
            )


            height = (
                row.get("Height")
                or row.get("height")
                or ""
            )


            weight = (
                row.get("Weight")
                or row.get("weight")
                or ""
            )


            address = (
                row.get("Address")
                or row.get("address")
                or ""
            )


            status = (
                row.get("Status")
                or row.get("status")
                or "Active"
            )


            medical_history = (
                row.get("Medical_History")
                or row.get("medical_history")
                or ""
            )


            allergies = (
                row.get("Allergies")
                or row.get("allergies")
                or ""
            )


            notes = (
                row.get("Notes")
                or row.get("notes")
                or ""
            )


            # ----------------------------------------------
            # BUILD PATIENT OBJECT
            # ----------------------------------------------

            patient = {

                "id": str(
                    patient_id
                ),

                "first_name": str(
                    first_name
                ),

                "last_name": str(
                    last_name
                ),

                "name": str(
                    name
                ),

                "date_of_birth": str(
                    date_of_birth
                ),

                "gender": str(
                    gender
                ),

                "phone": str(
                    phone
                ),

                "email": str(
                    email
                ),

                "blood_group": str(
                    blood_group
                ),

                "height": height,

                "weight": weight,

                "address": str(
                    address
                ),

                "status": str(
                    status
                ),

                "medical_history": str(
                    medical_history
                ),

                "allergies": str(
                    allergies
                ),

                "notes": str(
                    notes
                )
            }


            # ----------------------------------------------
            # CALCULATE AGE
            # ----------------------------------------------

            patient["age"] = calculate_age(
                patient["date_of_birth"]
            )


            all_patients.append(
                patient
            )


    # ------------------------------------------------------
    # TOTAL COUNTS
    # ------------------------------------------------------

    total_patients = len(
        all_patients
    )


    active_patients = sum(

        1

        for patient in all_patients

        if patient["status"] == "Active"

    )


    inactive_patients = (
        total_patients
        -
        active_patients
    )


    today_appointments = 18

    total_consultations = 3562


    # ------------------------------------------------------
    # TOTAL PAGES
    # ------------------------------------------------------

    total_pages = max(
        1,
        (
            total_patients
            +
            per_page
            -
            1
        )
        // per_page
    )


    # ------------------------------------------------------
    # VALIDATE PAGE
    # ------------------------------------------------------

    if page < 1:

        page = 1


    if page > total_pages:

        page = total_pages


    # ------------------------------------------------------
    # SLICE CURRENT PAGE
    # ------------------------------------------------------

    start_index = (
        (page - 1)
        *
        per_page
    )


    end_index = (
        start_index
        +
        per_page
    )


    page_patients = all_patients[
        start_index:end_index
    ]


    # ------------------------------------------------------
    # DISPLAY RANGE
    # ------------------------------------------------------

    if total_patients > 0:

        display_start = (
            start_index + 1
        )

        display_end = min(
            end_index,
            total_patients
        )

    else:

        display_start = 0

        display_end = 0


    # ------------------------------------------------------
    # RENDER
    # ------------------------------------------------------

    return render_template(

        "patients/patients.html",

        patients=page_patients,

        total_patients=total_patients,

        active_patients=active_patients,

        inactive_patients=inactive_patients,

        today_appointments=today_appointments,

        total_consultations=total_consultations,

        current_page=page,

        per_page=per_page,

        total_pages=total_pages,

        total_patient_results=total_patients,

        start_index=display_start,

        end_index=display_end

    )


# ==========================================================
# ADD PATIENT
# ==========================================================

@patients_bp.route(
    "/add",
    methods=["POST"]
)
@login_required
def add_patient():

    first_name = (
        request.form.get(
            "first_name",
            ""
        ).strip()
    )

    last_name = (
        request.form.get(
            "last_name",
            ""
        ).strip()
    )

    date_of_birth = (
        request.form.get(
            "date_of_birth",
            ""
        ).strip()
    )

    gender = (
        request.form.get(
            "gender",
            ""
        ).strip()
    )

    phone = (
        request.form.get(
            "phone",
            ""
        ).strip()
    )

    email = (
        request.form.get(
            "email",
            ""
        ).strip()
    )

    blood_group = (
        request.form.get(
            "blood_group",
            ""
        ).strip()
    )

    height = (
        request.form.get(
            "height",
            ""
        ).strip()
    )

    weight = (
        request.form.get(
            "weight",
            ""
        ).strip()
    )

    address = (
        request.form.get(
            "address",
            ""
        ).strip()
    )

    medical_history = (
        request.form.get(
            "medical_history",
            ""
        ).strip()
    )

    allergies = (
        request.form.get(
            "allergies",
            ""
        ).strip()
    )

    notes = (
        request.form.get(
            "notes",
            ""
        ).strip()
    )


    # ------------------------------------------------------
    # BASIC VALIDATION
    # ------------------------------------------------------

    if not first_name:

        flash(
            "First name is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    if not last_name:

        flash(
            "Last name is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    if not date_of_birth:

        flash(
            "Date of birth is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    if not gender:

        flash(
            "Gender is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    if not phone:

        flash(
            "Phone number is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    if not address:

        flash(
            "Address is required.",
            "error"
        )

        return redirect(
            url_for("patients.patients")
        )


    # ------------------------------------------------------
    # GENERATE PATIENT ID
    # ------------------------------------------------------

    new_number = (
        len(patients_data) + 1001
    )

    patient_id = (
        f"P{new_number}"
    )


    # ------------------------------------------------------
    # CREATE PATIENT
    # ------------------------------------------------------

    new_patient = {

        "id": patient_id,

        "first_name": first_name,

        "last_name": last_name,

        "name":
            f"{first_name} {last_name}",

        "date_of_birth":
            date_of_birth,

        "gender":
            gender,

        "phone":
            phone,

        "email":
            email,

        "blood_group":
            blood_group,

        "height":
            height,

        "weight":
            weight,

        "address":
            address,

        "status":
            "Active",

        "medical_history":
            medical_history,

        "allergies":
            allergies,

        "notes":
            notes
    }


    patients_data.append(
        new_patient
    )


    flash(
        f"Patient {patient_id} added successfully.",
        "success"
    )


    return redirect(
        url_for("patients.patients")
    )