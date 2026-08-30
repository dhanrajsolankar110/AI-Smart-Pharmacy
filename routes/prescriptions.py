"""
=========================================================
AI SMART PHARMACY
Prescriptions Routes
=========================================================
"""

from flask import (
    Blueprint,
    render_template,
    request,
    jsonify,
    redirect,
    url_for,
    flash
)

from datetime import datetime
from utils.data_loader import load_prescriptions_data


# =========================================================
# BLUEPRINT
# =========================================================

prescriptions_bp = Blueprint(
    "prescriptions",
    __name__,
    url_prefix="/prescriptions"
)


# =========================================================
# DEMO PRESCRIPTION DATA
# =========================================================
#
# This data is currently used to make the module look and
# behave like a completed pharmacy system.
#
# Later we can replace this with database queries.
# =========================================================

# =========================================================
# LOAD PRESCRIPTIONS FROM CSV
# =========================================================

def get_prescriptions():

    data = load_prescriptions_data()

    prescriptions = []


    if data is None or data.empty:

        return prescriptions


    data = data.fillna("")


    for row in data.to_dict(
        orient="records"
    ):

        prescription = {

            "id": str(
                row.get(
                    "Prescription_ID",
                    row.get(
                        "prescription_id",
                        ""
                    )
                )
            ),

            "patient_id": str(
                row.get(
                    "Patient_ID",
                    row.get(
                        "patient_id",
                        ""
                    )
                )
            ),

            "patient_name": str(
                row.get(
                    "Patient_Name",
                    row.get(
                        "patient_name",
                        ""
                    )
                )
            ),

            "doctor_name": str(
                row.get(
                    "Doctor_Name",
                    row.get(
                        "doctor_name",
                        ""
                    )
                )
            ),

            "doctor_speciality": str(
                row.get(
                    "Specialization",
                    row.get(
                        "Doctor_Speciality",
                        row.get(
                            "doctor_speciality",
                            "General Physician"
                        )
                    )
                )
            ),

            "date": str(
                row.get(
                    "Date",
                    row.get(
                        "date",
                        ""
                    )
                )
            ),

            "time": str(
                row.get(
                    "Time",
                    row.get(
                        "time",
                        ""
                    )
                )
            ),

            "medicine_count": int(
                float(
                    row.get(
                        "Medicine_Count",
                        row.get(
                            "medicine_count",
                            0
                        )
                    ) or 0
                )
            ),

            "medicine": str(
                row.get(
                    "Primary_Medicine",
                    row.get(
                        "Medicine",
                        row.get(
                            "medicine",
                            ""
                        )
                    )
                )
            ),

            "status": str(
                row.get(
                    "Status",
                    row.get(
                        "status",
                        "Pending"
                    )
                )
            ),

            "amount": float(
                row.get(
                    "Total_Amount_INR",
                    row.get(
                        "Amount",
                        row.get(
                            "amount",
                            0
                        )
                    ) or 0
                )
            ),

            "diagnosis": str(
                row.get(
                    "Diagnosis",
                    row.get(
                        "diagnosis",
                        ""
                    )
                )
            ),

            "refills": row.get(
                "Refills",
                0
            )

        }


        prescriptions.append(
            prescription
        )


    return prescriptions


# =========================================================
# PRESCRIPTION PAGE
# =========================================================

@prescriptions_bp.route("/")
def prescriptions():

    # -----------------------------------------------------
    # LOAD ALL PRESCRIPTIONS
    # -----------------------------------------------------

    all_prescriptions = get_prescriptions()


    # -----------------------------------------------------
    # PAGINATION
    # -----------------------------------------------------

    page = request.args.get(
        "page",
        1,
        type=int
    )

    per_page = 10


    total_prescriptions = len(
        all_prescriptions
    )


    total_pages = max(
        1,
        (
            total_prescriptions
            +
            per_page
            -
            1
        )
        // per_page
    )


    # Keep page valid

    if page < 1:

        page = 1


    if page > total_pages:

        page = total_pages


    # -----------------------------------------------------
    # CURRENT PAGE
    # -----------------------------------------------------

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


    page_prescriptions = (
        all_prescriptions[
            start_index:end_index
        ]
    )


    # -----------------------------------------------------
    # DISPLAY RANGE
    # -----------------------------------------------------

    if total_prescriptions > 0:

        display_start = (
            start_index + 1
        )

        display_end = min(
            end_index,
            total_prescriptions
        )

    else:

        display_start = 0
        display_end = 0


    # -----------------------------------------------------
    # STATISTICS
    # -----------------------------------------------------

    # Today's values can remain your demo dashboard
    # statistics unless you want them calculated from
    # actual dates.

    dispensed_today = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Dispensed"

    )


    pending_prescriptions = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Pending"

    )


    completed_today = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Completed"

    )


    # -----------------------------------------------------
    # OVERVIEW
    # -----------------------------------------------------

    dispensed_count = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Dispensed"

    )


    pending_count = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Pending"

    )


    completed_count = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Completed"

    )


    cancelled_count = sum(

        1

        for prescription
        in all_prescriptions

        if prescription["status"]
        == "Cancelled"

    )


    overview = {

        "dispensed": {

            "count":
                dispensed_count,

            "percentage":
                round(
                    (
                        dispensed_count
                        /
                        total_prescriptions
                        *
                        100
                    )
                    if total_prescriptions
                    else 0,
                    1
                )

        },

        "pending": {

            "count":
                pending_count,

            "percentage":
                round(
                    (
                        pending_count
                        /
                        total_prescriptions
                        *
                        100
                    )
                    if total_prescriptions
                    else 0,
                    1
                )

        },

        "completed": {

            "count":
                completed_count,

            "percentage":
                round(
                    (
                        completed_count
                        /
                        total_prescriptions
                        *
                        100
                    )
                    if total_prescriptions
                    else 0,
                    1
                )

        },

        "cancelled": {

            "count":
                cancelled_count,

            "percentage":
                round(
                    (
                        cancelled_count
                        /
                        total_prescriptions
                        *
                        100
                    )
                    if total_prescriptions
                    else 0,
                    1
                )

        }

    }


    # -----------------------------------------------------
    # RECENT PRESCRIPTIONS
    # -----------------------------------------------------

    recent_prescriptions = (
        all_prescriptions[:5]
    )


    # -----------------------------------------------------
    # DOCTORS
    # -----------------------------------------------------

    doctors = sorted(
        list(
            set(
                prescription[
                    "doctor_name"
                ]

                for prescription
                in all_prescriptions

                if prescription[
                    "doctor_name"
                ]
            )
        )
    )


    # -----------------------------------------------------
    # RENDER
    # -----------------------------------------------------

    return render_template(

        "prescriptions/prescriptions.html",

        # ONLY 10 ROWS GO TO THE TABLE
        prescriptions=page_prescriptions,

        recent_prescriptions=
            recent_prescriptions,

        total_prescriptions=
            total_prescriptions,

        dispensed_today=
            dispensed_today,

        pending_prescriptions=
            pending_prescriptions,

        completed_today=
            completed_today,

        overview=
            overview,

        doctors=
            doctors,

        # PAGINATION
        current_page=
            page,

        per_page=
            per_page,

        total_pages=
            total_pages,

        start_index=
            display_start,

        end_index=
            display_end,

        total_prescription_results=
            total_prescriptions
    )


# =========================================================
# GET SINGLE PRESCRIPTION
# =========================================================

@prescriptions_bp.route(
    "/<prescription_id>"
)
def prescription_details(
    prescription_id
):

    prescription = next(
        (
            item
            for item in PRESCRIPTIONS
            if item["id"] == prescription_id
        ),
        None
    )


    if prescription is None:

        return jsonify({
            "success": False,
            "message": "Prescription not found."
        }), 404


    return jsonify({
        "success": True,
        "prescription": prescription
    })


# =========================================================
# CREATE PRESCRIPTION
# =========================================================

@prescriptions_bp.route(
    "/create",
    methods=["POST"]
)
def create_prescription():

    try:

        # -------------------------------------------------
        # Get form data
        # -------------------------------------------------

        patient = request.form.get(
            "patient",
            ""
        ).strip()

        doctor = request.form.get(
            "doctor",
            ""
        ).strip()

        date = request.form.get(
            "date",
            ""
        ).strip()

        priority = request.form.get(
            "priority",
            "normal"
        ).strip()

        notes = request.form.get(
            "notes",
            ""
        ).strip()


        # -------------------------------------------------
        # Validation
        # -------------------------------------------------

        if not patient:

            return jsonify({
                "success": False,
                "message": "Please select a patient."
            }), 400


        if not doctor:

            return jsonify({
                "success": False,
                "message": "Please select a doctor."
            }), 400


        if not date:

            return jsonify({
                "success": False,
                "message": "Please select the prescription date."
            }), 400


        # -------------------------------------------------
        # Generate prescription ID
        # -------------------------------------------------

        prescription_id = (
            "RX"
            + datetime.now().strftime(
                "%y%m%d%H%M%S"
            )
        )


        # -------------------------------------------------
        # Create temporary prescription
        # -------------------------------------------------

        new_prescription = {

            "id": prescription_id,

            "patient_id": patient,

            "patient": patient,

            "doctor": doctor,

            "specialization":
                "General Physician",

            "date": date,

            "time":
                datetime.now().strftime(
                    "%I:%M %p"
                ),

            "medicines": 1,

            "status": "Pending",

            "amount": 0.00,

            "priority": priority,

            "notes": notes

        }


        # -------------------------------------------------
        # Add to demo storage
        # -------------------------------------------------

        PRESCRIPTIONS.insert(
            0,
            new_prescription
        )


        return jsonify({

            "success": True,

            "message":
                "Prescription created successfully.",

            "prescription":
                new_prescription

        })


    except Exception as error:

        return jsonify({

            "success": False,

            "message":
                f"Unable to create prescription: {error}"

        }), 500


# =========================================================
# CANCEL PRESCRIPTION
# =========================================================

@prescriptions_bp.route(
    "/<prescription_id>/cancel",
    methods=["POST"]
)
def cancel_prescription(
    prescription_id
):

    prescription = next(
        (
            item
            for item in PRESCRIPTIONS
            if item["id"] == prescription_id
        ),
        None
    )


    if prescription is None:

        return jsonify({

            "success": False,

            "message":
                "Prescription not found."

        }), 404


    prescription["status"] = "Cancelled"


    return jsonify({

        "success": True,

        "message":
            "Prescription cancelled successfully.",

        "prescription":
            prescription

    })


# =========================================================
# DOWNLOAD / EXPORT DATA
# =========================================================

@prescriptions_bp.route(
    "/export"
)
def export_prescriptions():

    return jsonify({

        "success": True,

        "message":
            "Prescription export endpoint is ready.",

        "count":
            len(PRESCRIPTIONS)

    })


# =========================================================
# END OF FILE
# =========================================================