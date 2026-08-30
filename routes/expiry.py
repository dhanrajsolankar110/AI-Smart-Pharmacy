from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    session
)

from datetime import date

from database import db
from utils.auth import login_required
from models.medicine import Medicine
from utils.data_loader import load_expiry_data


# ==========================================================
# BLUEPRINT
# ==========================================================

expiry_bp = Blueprint(
    "expiry",
    __name__
)


# ==========================================================
# HELPER - DAYS LEFT
# ==========================================================

def calculate_days_left(expiry_date):

    if not expiry_date:

        return None

    return (
        expiry_date - date.today()
    ).days


# ==========================================================
# HELPER - EXPIRY STATUS
# ==========================================================

def calculate_expiry_status(days_left):

    if days_left is None:

        return "Safe"

    if days_left < 0:

        return "Expired"

    if days_left <= 30:

        return "Critical"

    if days_left <= 60:

        return "Warning"

    return "Safe"


# ==========================================================
# PREPARE EXPIRY DATA
# ==========================================================

def prepare_expiry_data(medicine):

    days_left = calculate_days_left(
        medicine.expiry_date
    )

    expiry_status = calculate_expiry_status(
        days_left
    )

    return {

        "medicine": medicine,

        "days_left": days_left,

        "expiry_status": expiry_status

    }


# ==========================================================
# EXPIRY INTELLIGENCE PAGE
# ==========================================================

@expiry_bp.route("/expiry")
@login_required
def expiry():

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
    # BASE QUERY
    # Only medicines having an expiry date
    # ------------------------------------------------------

    query = (
        Medicine.query
        .filter(
            Medicine.expiry_date.isnot(None)
        )
        .order_by(
            Medicine.expiry_date.asc()
        )
    )


    # ------------------------------------------------------
    # GLOBAL TOTAL
    # ------------------------------------------------------

    total_expiry_items = query.count()


    # ------------------------------------------------------
    # GLOBAL COUNTS
    # ------------------------------------------------------

    all_medicines = query.all()


    expired_count = 0
    expiring_30 = 0
    expiring_60 = 0
    safe_count = 0


    for medicine in all_medicines:

        days_left = calculate_days_left(
            medicine.expiry_date
        )


        if days_left < 0:

            expired_count += 1

        elif days_left <= 30:

            expiring_30 += 1

        elif days_left <= 60:

            expiring_60 += 1

        else:

            safe_count += 1


    # ------------------------------------------------------
    # PAGINATED RESULTS
    # ------------------------------------------------------

    pagination = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )


    # ------------------------------------------------------
    # PREPARE ONLY CURRENT PAGE
    # ------------------------------------------------------

    expiry_medicines = []


    for medicine in pagination.items:

        expiry_medicines.append(
            prepare_expiry_data(
                medicine
            )
        )


    # ------------------------------------------------------
    # CATEGORIES
    # ------------------------------------------------------

    categories = (
        db.session.query(
            Medicine.category
        )
        .filter(
            Medicine.category.isnot(None)
        )
        .distinct()
        .order_by(
            Medicine.category
        )
        .all()
    )


    # ------------------------------------------------------
    # RENDER
    # ------------------------------------------------------

    return render_template(

        "expiry/expiry.html",

        expiry_medicines=expiry_medicines,

        pagination=pagination,

        total_expiry_items=total_expiry_items,

        expired_count=expired_count,

        expiring_30=expiring_30,

        expiring_60=expiring_60,

        safe_count=safe_count,

        categories=categories,

        medicines=all_medicines,

        current_date=date.today().strftime(
            "%d %B %Y"
        )

    )

# ==========================================================
# ADD EXPIRY ALERT
# ==========================================================

@expiry_bp.route(
    "/add-alert",
    methods=["POST"]
)
@login_required
def add_alert():

    try:

        medicine_id = request.form.get(
            "medicine_id"
        )

        alert_name = request.form.get(
            "alert_name",
            ""
        ).strip()

        days_before = request.form.get(
            "days_before",
            "30"
        )

        priority = request.form.get(
            "priority",
            "Medium"
        )

        notification_method = request.form.get(
            "notification_method",
            "Dashboard"
        )

        repeat_frequency = request.form.get(
            "repeat_frequency",
            "Once"
        )

        status = request.form.get(
            "status",
            "Active"
        )

        notes = request.form.get(
            "notes",
            ""
        )


        # ==================================================
        # FIND MEDICINE
        # ==================================================

        medicine = Medicine.query.get(
            medicine_id
        )

        if not medicine:

            flash(
                "Selected medicine was not found.",
                "danger"
            )

            return redirect(
                url_for("expiry.expiry")
            )


        # ==================================================
        # VALIDATE DAYS
        # ==================================================

        try:

            days_before = int(
                days_before
            )

        except (
            TypeError,
            ValueError
        ):

            days_before = 30


        if days_before <= 0:

            days_before = 30


        # ==================================================
        # DEFAULT ALERT NAME
        # ==================================================

        if not alert_name:

            alert_name = (
                medicine.medicine_name
                + " Expiry Alert"
            )


        # ==================================================
        # STORE ALERT IN SESSION
        #
        # We are not adding an ExpiryAlert database model
        # because your current project does not have one.
        # ==================================================

        alerts = session.get(
            "expiry_alerts",
            []
        )

        new_alert = {

            "medicine_id":
                medicine.id,

            "medicine_name":
                medicine.medicine_name,

            "alert_name":
                alert_name,

            "days_before":
                days_before,

            "priority":
                priority,

            "notification_method":
                notification_method,

            "repeat_frequency":
                repeat_frequency,

            "status":
                status,

            "notes":
                notes

        }

        alerts.append(
            new_alert
        )

        session[
            "expiry_alerts"
        ] = alerts

        session.modified = True


        flash(
            "Expiry alert created successfully.",
            "success"
        )


    except Exception as e:

        flash(
            f"Unable to create expiry alert: {str(e)}",
            "danger"
        )


    return redirect(
        url_for(
            "expiry.expiry"
        )
    )


# ==========================================================
# SAVE ALERT SETTINGS
# ==========================================================

@expiry_bp.route(
    "/save-alert-settings",
    methods=["POST"]
)
@login_required
def save_alert_settings():

    try:

        default_days = request.form.get(
            "default_days",
            "30"
        )

        report_time = request.form.get(
            "report_time",
            "09:00"
        )

        email_notifications = request.form.get(
            "email_notifications",
            "Enabled"
        )

        sms_notifications = request.form.get(
            "sms_notifications",
            "Disabled"
        )

        dashboard_notifications = request.form.get(
            "dashboard_notifications",
            "Enabled"
        )

        auto_archive = request.form.get(
            "auto_archive",
            "No"
        )

        alert_sound = request.form.get(
            "alert_sound",
            "Enabled"
        )

        priority = request.form.get(
            "priority",
            "Medium"
        )

        notes = request.form.get(
            "notes",
            ""
        )


        # ==================================================
        # VALIDATE DEFAULT DAYS
        # ==================================================

        try:

            default_days = int(
                default_days
            )

        except (
            TypeError,
            ValueError
        ):

            default_days = 30


        if default_days <= 0:

            default_days = 30


        # ==================================================
        # SAVE SETTINGS
        # ==================================================

        session[
            "expiry_alert_settings"
        ] = {

            "default_days":
                default_days,

            "report_time":
                report_time,

            "email_notifications":
                email_notifications,

            "sms_notifications":
                sms_notifications,

            "dashboard_notifications":
                dashboard_notifications,

            "auto_archive":
                auto_archive,

            "alert_sound":
                alert_sound,

            "priority":
                priority,

            "notes":
                notes

        }

        session.modified = True


        flash(
            "Expiry alert settings saved successfully.",
            "success"
        )


    except Exception as e:

        flash(
            f"Unable to save alert settings: {str(e)}",
            "danger"
        )


    return redirect(
        url_for(
            "expiry.expiry"
        )
    )

# ==========================================================
# VIEW EXPIRY DETAILS
# ==========================================================

@expiry_bp.route(
    "/view/<int:id>"
)
@login_required
def view_expiry(id):

    medicine = Medicine.query.get_or_404(
        id
    )

    # Calculate dynamically.
    # Do NOT assign these values to the Medicine object.

    days_left = calculate_days_left(
        medicine.expiry_date
    )

    expiry_status = calculate_expiry_status(
        days_left
    )

    return {

        "id":
            medicine.id,

        "medicine_code":
            medicine.medicine_code or "",

        "medicine_name":
            medicine.medicine_name or "",

        "generic_name":
            medicine.generic_name or "",

        "category":
            medicine.category or "",

        "manufacturer":
            medicine.manufacturer or "",

        "supplier":
            medicine.supplier or "",

        "batch_number":
            medicine.batch_number or "",

        "expiry_date":
            (
                medicine.expiry_date.strftime(
                    "%d %b %Y"
                )
                if medicine.expiry_date
                else ""
            ),

        "days_left":
            days_left,

        "expiry_status":
            expiry_status,

        "quantity":
            medicine.quantity or 0,

        "reorder_level":
            medicine.reorder_level or 0,

        "purchase_price":
            float(
                medicine.purchase_price or 0
            ),

        "selling_price":
            float(
                medicine.selling_price or 0
            ),

        "description":
            medicine.description or "",

        "image":
            medicine.image or ""

    }


# ==========================================================
# SEARCH EXPIRY MEDICINES
# ==========================================================

@expiry_bp.route(
    "/search"
)
@login_required
def search_expiry():

    keyword = request.args.get(
        "keyword",
        ""
    ).strip().lower()

    category = request.args.get(
        "category",
        ""
    ).strip().lower()

    status = request.args.get(
        "status",
        ""
    ).strip().lower()


    medicines = Medicine.query.all()

    expiry_medicines = []


    for medicine in medicines:

        if not medicine.expiry_date:

            continue


        # ==============================================
        # CALCULATE WITHOUT MODIFYING MODEL
        # ==============================================

        days_left = calculate_days_left(
            medicine.expiry_date
        )

        expiry_status = calculate_expiry_status(
            days_left
        )


        # ==============================================
        # SEARCH TEXT
        # ==============================================

        searchable_text = " ".join([

            str(
                medicine.medicine_name or ""
            ),

            str(
                medicine.generic_name or ""
            ),

            str(
                medicine.batch_number or ""
            ),

            str(
                medicine.medicine_code or ""
            )

        ]).lower()


        if (
            keyword
            and keyword not in searchable_text
        ):

            continue


        # ==============================================
        # CATEGORY FILTER
        # ==============================================

        medicine_category = (

            str(
                medicine.category or ""
            )
            .strip()
            .lower()

        )


        if (
            category
            and medicine_category != category
        ):

            continue


        # ==============================================
        # STATUS FILTER
        # ==============================================

        medicine_status = (

            expiry_status
            .strip()
            .lower()

        )


        if (
            status
            and medicine_status != status
        ):

            continue


        expiry_medicines.append({

            "medicine":
                medicine,

            "days_left":
                days_left,

            "expiry_status":
                expiry_status

        })


    # ======================================================
    # COUNTS
    # ======================================================

    expired_count = sum(

        1

        for item in expiry_medicines

        if item["days_left"] < 0

    )

    expiring_30 = sum(

        1

        for item in expiry_medicines

        if 0 <= item["days_left"] <= 30

    )

    expiring_60 = sum(

        1

        for item in expiry_medicines

        if 31 <= item["days_left"] <= 60

    )

    safe_count = sum(

        1

        for item in expiry_medicines

        if item["days_left"] > 60

    )


    # ======================================================
    # CATEGORIES
    # ======================================================

    categories = (

        db.session.query(

            Medicine.category

        )

        .filter(

            Medicine.category.isnot(None)

        )

        .distinct()

        .order_by(

            Medicine.category

        )

        .all()

    )


    return render_template(

        "expiry/expiry.html",

        expiry_medicines=
            expiry_medicines,

        expired_count=
            expired_count,

        expiring_30=
            expiring_30,

        expiring_60=
            expiring_60,

        safe_count=
            safe_count,

        categories=
            categories,

        medicines=
            medicines,

        current_date=
            date.today().strftime(
                "%d %B %Y"
            )

    )

# ==========================================================
# REFRESH EXPIRY INTELLIGENCE
# ==========================================================

@expiry_bp.route(
    "/refresh",
    methods=["GET"]
)
@login_required
def refresh_expiry():

    # Expiry status is calculated dynamically from
    # the medicine expiry_date.
    #
    # Nothing needs to be written to the Medicine table.

    flash(
        "Expiry intelligence refreshed successfully.",
        "success"
    )

    return redirect(
        url_for(
            "expiry.expiry"
        )
    )


# ==========================================================
# END OF EXPIRY ROUTES
# ==========================================================