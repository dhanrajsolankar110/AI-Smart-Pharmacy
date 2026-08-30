# ==========================================================
# GLOBAL SEARCH
# AI SMART PHARMACY
# ==========================================================

from flask import (
    Blueprint,
    request,
    jsonify
)

from utils.auth import login_required
from models.medicine import Medicine

from models.patient import Patient
from models.prescription import Prescription


global_search_bp = Blueprint(
    "global_search",
    __name__
)


# ==========================================================
# GLOBAL SEARCH
# ==========================================================

@global_search_bp.route(
    "/global-search",
    methods=["GET"]
)
@login_required
def global_search():

    keyword = request.args.get(
        "q",
        ""
    ).strip()

    # ------------------------------------------------------
    # Do not search for empty text
    # ------------------------------------------------------

    if not keyword:

        return jsonify({
            "results": []
        })


    search = f"%{keyword}%"


    results = []


    # ======================================================
    # MEDICINES
    # ======================================================

    medicines = (
        Medicine.query
        .filter(
            Medicine.medicine_name.ilike(search)
            |
            Medicine.generic_name.ilike(search)
            |
            Medicine.category.ilike(search)
            |
            Medicine.manufacturer.ilike(search)
            |
            Medicine.medicine_code.ilike(search)
            |
            Medicine.batch_number.ilike(search)
            |
            Medicine.barcode.ilike(search)
        )
        .order_by(
            Medicine.medicine_name.asc()
        )
        .limit(8)
        .all()
    )


    for medicine in medicines:

        results.append({

            "type": "Medicine",

            "title":
                medicine.medicine_name
                or "Unnamed Medicine",

            "subtitle":
                (
                    medicine.generic_name
                    or medicine.category
                    or "Medicine"
                ),

            "extra":
                medicine.status
                or "",

            "icon":
                "fa-solid fa-pills",

            "color":
                "purple",

            "url":
                "/medicines"

        })


    # ======================================================
    # PATIENTS
    # ======================================================

    try:

        patients = (
            Patient.query
            .filter(
                Patient.name.ilike(search)
                |
                Patient.id.ilike(search)
                |
                Patient.phone.ilike(search)
                |
                Patient.email.ilike(search)
            )
            .order_by(
                Patient.name.asc()
            )
            .limit(8)
            .all()
        )


        for patient in patients:

            results.append({

                "type": "Patient",

                "title":
                    patient.name
                    or "Unnamed Patient",

                "subtitle":
                    f"Patient ID: {patient.id}",

                "extra":
                    patient.phone
                    or "",

                "icon":
                    "fa-solid fa-user",

                "color":
                    "green",

                "url":
                    "/patients"

            })

    except Exception:

        pass


    # ======================================================
    # PRESCRIPTIONS
    # ======================================================

    try:

        prescriptions = (
            Prescription.query
            .filter(
                Prescription.id.ilike(search)
                |
                Prescription.patient_name.ilike(search)
                |
                Prescription.doctor_name.ilike(search)
            )
            .order_by(
                Prescription.id.desc()
            )
            .limit(8)
            .all()
        )


        for prescription in prescriptions:

            results.append({

                "type": "Prescription",

                "title":
                    prescription.id
                    or "Prescription",

                "subtitle":
                    (
                        prescription.patient_name
                        or "Prescription"
                    ),

                "extra":
                    prescription.status
                    or "",

                "icon":
                    "fa-solid fa-file-prescription",

                "color":
                    "orange",

                "url":
                    "/prescriptions"

            })

    except Exception:

        pass


    # ======================================================
    # LIMIT FINAL RESULTS
    # ======================================================

    results = results[:20]


    return jsonify({
        "results": results
    })