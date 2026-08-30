"""
=========================================================
AI SMART PHARMACY
Settings Routes
File: routes/settings.py
=========================================================
"""

from flask import Blueprint, render_template, jsonify, request

from utils.auth import login_required


# =========================================================
# BLUEPRINT
# =========================================================

settings_bp = Blueprint(
    "settings",
    __name__,
    url_prefix="/settings"
)


# =========================================================
# SETTINGS PAGE
# =========================================================

@settings_bp.route("/", methods=["GET"])
@login_required
def settings():

    # =====================================================
    # PROFILE DATA
    # =====================================================

    profile = {
        "full_name": "Pharmacist",
        "email": "pharmacist@aismartpharmacy.com",
        "phone": "+91 98765 43210",
        "username": "pharmacist01",
        "date_of_birth": "15/06/1990",
        "gender": "Male",
        "address": (
            "AI Smart Pharmacy, 123 Health Street, "
            "Medical Area, Mumbai, Maharashtra - 400001"
        )
    }


    # =====================================================
    # SYSTEM PREFERENCES
    # =====================================================

    system_preferences = {

        "language": "English",

        "date_format": "dd/mm/yyyy",

        "time_format": "12 Hour (01:30 PM)",

        "timezone": "(GMT+05:30) Asia/Kolkata"

    }


    # =====================================================
    # APPLICATION SETTINGS
    # =====================================================

    application_settings = {

        "low_stock_alerts": True,

        "expiry_alerts": True,

        "email_notifications": True,

        "dark_mode": False

    }


    # =====================================================
    # USER SETTINGS DATA
    # =====================================================

    settings_users = [

        {
            "id": "USR00001",
            "name": "Pharmacist",
            "username": "pharmacist01",
            "role": "Pharmacist",
            "status": "Active"
        },

        {
            "id": "USR00002",
            "name": "Dr. Amit Kumar",
            "username": "amit.kumar",
            "role": "Doctor",
            "status": "Active"
        },

        {
            "id": "USR00003",
            "name": "Priya Sharma",
            "username": "priya.sharma",
            "role": "Pharmacy Manager",
            "status": "Active"
        }

    ]


    # =====================================================
    # SYSTEM INFORMATION
    # =====================================================

    system_info = {

        "application_name": "AI Smart Pharmacy",

        "version": "1.0.0",

        "environment": "Development",

        "database": "SQLite",

        "python_version": "3.11+",

        "last_backup": "09 Aug 2026, 10:30 AM"

    }


    # =====================================================
    # RENDER SETTINGS PAGE
    # =====================================================

    return render_template(
        "settings/settings.html",

        profile=profile,

        system_preferences=system_preferences,

        application_settings=application_settings,

        settings_users=settings_users,

        system_info=system_info
    )


# =========================================================
# SAVE PROFILE
# =========================================================

@settings_bp.route("/save-profile", methods=["POST"])
@login_required
def save_profile():

    data = request.get_json(silent=True) or request.form

    full_name = data.get("full_name", "").strip()

    email = data.get("email", "").strip()

    phone = data.get("phone", "").strip()

    username = data.get("username", "").strip()

    address = data.get("address", "").strip()


    if not full_name:

        return jsonify({
            "success": False,
            "message": "Full name is required."
        }), 400


    if not email:

        return jsonify({
            "success": False,
            "message": "Email address is required."
        }), 400


    # -----------------------------------------------------
    # DEMO MODE
    # -----------------------------------------------------
    # Database persistence can be connected later.
    # -----------------------------------------------------

    return jsonify({

        "success": True,

        "message": "Profile changes saved successfully.",

        "profile": {

            "full_name": full_name,

            "email": email,

            "phone": phone,

            "username": username,

            "address": address

        }

    })


# =========================================================
# CHANGE PASSWORD
# =========================================================

@settings_bp.route("/change-password", methods=["POST"])
@login_required
def change_password():

    data = request.get_json(silent=True) or request.form

    current_password = data.get(
        "current_password",
        ""
    )

    new_password = data.get(
        "new_password",
        ""
    )

    confirm_password = data.get(
        "confirm_password",
        ""
    )


    # -----------------------------------------------------
    # VALIDATION
    # -----------------------------------------------------

    if not current_password:

        return jsonify({

            "success": False,

            "message":
                "Current password is required."

        }), 400


    if not new_password:

        return jsonify({

            "success": False,

            "message":
                "New password is required."

        }), 400


    if len(new_password) < 6:

        return jsonify({

            "success": False,

            "message":
                "Password must contain at least 6 characters."

        }), 400


    if new_password != confirm_password:

        return jsonify({

            "success": False,

            "message":
                "Passwords do not match."

        }), 400


    # -----------------------------------------------------
    # DEMO MODE
    # -----------------------------------------------------

    return jsonify({

        "success": True,

        "message":
            "Password updated successfully."

    })


# =========================================================
# SAVE SYSTEM PREFERENCES
# =========================================================

@settings_bp.route(
    "/save-preferences",
    methods=["POST"]
)
@login_required
def save_preferences():

    data = request.get_json(silent=True) or request.form


    language = data.get(
        "language",
        "English"
    )

    date_format = data.get(
        "date_format",
        "dd/mm/yyyy"
    )

    time_format = data.get(
        "time_format",
        "12 Hour (01:30 PM)"
    )

    timezone = data.get(
        "timezone",
        "(GMT+05:30) Asia/Kolkata"
    )


    return jsonify({

        "success": True,

        "message":
            "System preferences saved successfully.",

        "preferences": {

            "language": language,

            "date_format": date_format,

            "time_format": time_format,

            "timezone": timezone

        }

    })


# =========================================================
# SAVE APPLICATION SETTINGS
# =========================================================

@settings_bp.route(
    "/save-application-settings",
    methods=["POST"]
)
@login_required
def save_application_settings():

    data = request.get_json(silent=True) or request.form


    def get_boolean(name):

        value = data.get(name, False)

        if isinstance(value, bool):
            return value

        return str(value).lower() in [
            "true",
            "1",
            "yes",
            "on"
        ]


    settings = {

        "low_stock_alerts":
            get_boolean("low_stock_alerts"),

        "expiry_alerts":
            get_boolean("expiry_alerts"),

        "email_notifications":
            get_boolean("email_notifications"),

        "dark_mode":
            get_boolean("dark_mode")

    }


    return jsonify({

        "success": True,

        "message":
            "Application settings saved successfully.",

        "settings": settings

    })


# =========================================================
# BACKUP DATA
# =========================================================

@settings_bp.route(
    "/backup",
    methods=["POST"]
)
@login_required
def backup():

    return jsonify({

        "success": True,

        "message":
            "Backup created successfully.",

        "backup_file":
            "AI_Smart_Pharmacy_Backup.zip"

    })


# =========================================================
# RESET SYSTEM
# =========================================================

@settings_bp.route(
    "/reset",
    methods=["POST"]
)
@login_required
def reset_system():

    return jsonify({

        "success": True,

        "message":
            "System reset completed successfully."

    })


# =========================================================
# SYSTEM INFORMATION
# =========================================================

@settings_bp.route(
    "/system-info",
    methods=["GET"]
)
@login_required
def system_information():

    return jsonify({

        "success": True,

        "system": {

            "application":
                "AI Smart Pharmacy",

            "version":
                "1.0.0",

            "environment":
                "Development",

            "database":
                "SQLite"

        }

    })