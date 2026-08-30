import os

from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash

from config import Config
from database import db

from models import *
from models.user import User

from utils.create_admin import create_admin

from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.medicines import medicine_bp
from routes.stock import stock_bp
from routes.expiry import expiry_bp
from routes.reports import reports_bp
from routes.patients import patients_bp
from routes.prescriptions import prescriptions_bp
from routes.notifications import notifications_bp
from routes.settings import settings_bp
from routes.global_search import global_search_bp


app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(
    "static",
    "uploads",
    "medicines"
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

app.config.from_object(Config)

db.init_app(app)


app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(medicine_bp)
app.register_blueprint(stock_bp)
app.register_blueprint(expiry_bp)
app.register_blueprint(reports_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(prescriptions_bp)
app.register_blueprint(notifications_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(global_search_bp)


def create_default_admin():

    admin = User.query.filter_by(
        role="Administrator"
    ).first()


    if not admin:

        admin = User(

            full_name="Admin User",

            email="admin",

            password=generate_password_hash(
                "admin"
            ),

            role="Administrator"

        )

        db.session.add(admin)

        db.session.commit()

    else:

        admin.full_name = "Admin User"

        admin.password = generate_password_hash(
            "admin"
        )

        admin.email = "admin"

        db.session.commit()


@app.route("/", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        username = request.form.get(
            "email",
            ""
        ).strip()

        password = request.form.get(
            "password",
            ""
        ).strip()


        # ==================================================
        # DEMO ADMIN LOGIN
        # Username: admin
        # Password: admin
        # ==================================================

        if (
            username == "admin"
            and password == "admin"
        ):

            user = User.query.filter_by(
                role="Administrator"
            ).first()


            if user:

                session["user_id"] = user.id

                session["user_name"] = (
                    "Admin User"
                )

                return redirect(
                    url_for("dashboard")
                )


        flash(
            "Invalid Username or Password",
            "danger"
        )


    return render_template(
        "auth/login.html"
    )

from functools import wraps

def login_required(view):

    @wraps(view)

    def wrapped(*args, **kwargs):

        if "user_id" not in session:

            return redirect(url_for("login"))

        return view(*args, **kwargs)

    return wrapped


@app.route("/dashboard")
@login_required
def dashboard():

    total_medicines = 1245
    low_stock = 23
    expiring_soon = 17
    total_patients = 482

    return render_template(
        "dashboard/dashboard.html",
        total_medicines=total_medicines,
        low_stock=low_stock,
        expiring_soon=expiring_soon,
        total_patients=total_patients
    )


@app.route("/medicines")
@login_required
def medicines():
    return render_template("medicines/medicines.html")


@app.route("/stock")
@login_required
def stock():
    return render_template("stock/stock.html")


@app.route("/expiry")
@login_required
def expiry():
    return render_template("expiry/expiry.html")


@app.route("/reports")
@login_required
def reports():
    return render_template("reports/reports.html")


@app.route("/patients")
@login_required
def patients():

    patients = [
        {
            "id": "P1001",
            "name": "Rahul Sharma",
            "date_of_birth": "1992-05-12",
            "gender": "Male",
            "phone": "9876543210",
            "email": "rahulsharma@email.com",
            "status": "Active",
            "age": 34
        },
        {
            "id": "P1002",
            "name": "Priya Mehta",
            "date_of_birth": "1997-09-18",
            "gender": "Female",
            "phone": "8765432109",
            "email": "priyamehta@email.com",
            "status": "Active",
            "age": 28
        },
        {
            "id": "P1003",
            "name": "Amit Verma",
            "date_of_birth": "1981-03-04",
            "gender": "Male",
            "phone": "9654781230",
            "email": "amitverma@email.com",
            "status": "Active",
            "age": 45
        },
        {
            "id": "P1004",
            "name": "Sneha Patil",
            "date_of_birth": "1994-01-21",
            "gender": "Female",
            "phone": "9123456780",
            "email": "snehapatil@email.com",
            "status": "Inactive",
            "age": 32
        },
        {
            "id": "P1005",
            "name": "Vikram Singh",
            "date_of_birth": "1975-08-15",
            "gender": "Male",
            "phone": "9988776655",
            "email": "vikramsingh@email.com",
            "status": "Active",
            "age": 50
        },
        {
            "id": "P1006",
            "name": "Neha Gupta",
            "date_of_birth": "1999-11-09",
            "gender": "Female",
            "phone": "8899001122",
            "email": "nehagupta@email.com",
            "status": "Active",
            "age": 26
        },
        {
            "id": "P1007",
            "name": "Sanjay Kumar",
            "date_of_birth": "1988-06-17",
            "gender": "Male",
            "phone": "7766554433",
            "email": "sanjaykumar@email.com",
            "status": "Inactive",
            "age": 38
        },
        {
            "id": "P1008",
            "name": "Anjali Desai",
            "date_of_birth": "1996-02-27",
            "gender": "Female",
            "phone": "9900112233",
            "email": "anjalidesai@email.com",
            "status": "Active",
            "age": 30
        }
    ]

    total_patients = 1248
    active_patients = 892
    inactive_patients = 356
    today_appointments = 18
    total_consultations = 3562

    return render_template(
        "patients/patients.html",
        patients=patients,
        total_patients=total_patients,
        active_patients=active_patients,
        inactive_patients=inactive_patients,
        today_appointments=today_appointments,
        total_consultations=total_consultations
    )


@app.route("/prescriptions")
@login_required
def prescriptions():

    # ======================================================
    # PRESCRIPTION DEMO DATA
    # ======================================================

    prescriptions = [
        {
            "id": "RX250731001",
            "patient_name": "Rahul Sharma",
            "patient_id": "P1001",
            "doctor_name": "Dr. Amit Kumar",
            "date": "31 Jul 2026",
            "time": "10:30 AM",
            "medicines": 4,
            "status": "Dispensed",
            "amount": 856.00
        },
        {
            "id": "RX250731002",
            "patient_name": "Priya Mehta",
            "patient_id": "P1002",
            "doctor_name": "Dr. Neha Singh",
            "date": "31 Jul 2026",
            "time": "09:15 AM",
            "medicines": 3,
            "status": "Pending",
            "amount": 542.50
        },
        {
            "id": "RX250730015",
            "patient_name": "Amit Verma",
            "patient_id": "P1003",
            "doctor_name": "Dr. Rajesh Patel",
            "date": "30 Jul 2026",
            "time": "06:45 PM",
            "medicines": 5,
            "status": "Dispensed",
            "amount": 1245.00
        },
        {
            "id": "RX250730014",
            "patient_name": "Sneha Patil",
            "patient_id": "P1004",
            "doctor_name": "Dr. Priya Nair",
            "date": "30 Jul 2026",
            "time": "04:20 PM",
            "medicines": 2,
            "status": "Pending",
            "amount": 315.00
        },
        {
            "id": "RX250730013",
            "patient_name": "Vikram Singh",
            "patient_id": "P1005",
            "doctor_name": "Dr. Amit Kumar",
            "date": "30 Jul 2026",
            "time": "11:10 AM",
            "medicines": 4,
            "status": "Completed",
            "amount": 978.00
        },
        {
            "id": "RX250729012",
            "patient_name": "Neha Gupta",
            "patient_id": "P1006",
            "doctor_name": "Dr. Sunil Joshi",
            "date": "29 Jul 2026",
            "time": "07:30 PM",
            "medicines": 3,
            "status": "Dispensed",
            "amount": 654.00
        },
        {
            "id": "RX250729011",
            "patient_name": "Sanjay Kumar",
            "patient_id": "P1007",
            "doctor_name": "Dr. Rajesh Patel",
            "date": "29 Jul 2026",
            "time": "02:05 PM",
            "medicines": 6,
            "status": "Completed",
            "amount": 1520.50
        },
        {
            "id": "RX250729010",
            "patient_name": "Anjali Desai",
            "patient_id": "P1008",
            "doctor_name": "Dr. Priya Nair",
            "date": "29 Jul 2026",
            "time": "10:25 AM",
            "medicines": 2,
            "status": "Dispensed",
            "amount": 280.00
        }
    ]


    # ======================================================
    # PAGINATION
    # ======================================================

    current_page = 1

    per_page = 8

    total_prescriptions = 1245

    total_pages = (
        (total_prescriptions + per_page - 1)
        // per_page
    )


    start_index = (
        (current_page - 1)
        * per_page
        + 1
    )


    end_index = min(
        current_page * per_page,
        total_prescriptions
    )


    # ======================================================
    # STATISTICS
    # ======================================================

    total_prescriptions_count = 1245

    dispensed_today = 48

    pending_prescriptions = 15

    completed_today = 33


    # ======================================================
    # OVERVIEW
    # ======================================================

    overview = {

        "dispensed": {
            "count": 812,
            "percentage": 65.3
        },

        "pending": {
            "count": 184,
            "percentage": 14.8
        },

        "completed": {
            "count": 146,
            "percentage": 11.7
        },

        "cancelled": {
            "count": 103,
            "percentage": 8.2
        }

    }


    # ======================================================
    # DOCTORS
    # ======================================================

    doctors = sorted(
        {
            prescription["doctor_name"]
            for prescription in prescriptions
        }
    )


    # ======================================================
    # RECENT PRESCRIPTIONS
    # ======================================================

    recent_prescriptions = prescriptions[:5]


    # ======================================================
    # RENDER
    # ======================================================

    return render_template(

        "prescriptions/prescriptions.html",

        prescriptions=prescriptions,

        recent_prescriptions=recent_prescriptions,

        total_prescriptions=
            total_prescriptions_count,

        dispensed_today=
            dispensed_today,

        pending_prescriptions=
            pending_prescriptions,

        completed_today=
            completed_today,

        overview=overview,

        doctors=doctors,

        current_page=current_page,

        per_page=per_page,

        total_pages=total_pages,

        start_index=start_index,

        end_index=end_index,

        total_prescription_count=
            total_prescriptions

    )


@app.route("/notifications")
@login_required
def notifications():

    # =====================================================
    # DEMO NOTIFICATIONS
    # =====================================================

    notifications_data = [

        {
            "id": 1,
            "title": "Medicine Expired",
            "description": "Paracetamol 500mg (Batch: PARA240401) has expired.",
            "type": "Expiry Alert",
            "priority": "High",
            "date": "31 Jul 2026",
            "time": "10:30 AM",
            "status": "Unread",
            "icon": "fa-triangle-exclamation"
        },

        {
            "id": 2,
            "title": "Medicine Expiring Soon",
            "description": "Amoxicillin 250mg (Batch: AMOX240402) will expire in 5 days.",
            "type": "Expiry Alert",
            "priority": "Medium",
            "date": "31 Jul 2026",
            "time": "09:15 AM",
            "status": "Unread",
            "icon": "fa-clock"
        },

        {
            "id": 3,
            "title": "Low Stock Alert",
            "description": "Cetirizine 10mg stock is running low. Current stock: 18 units.",
            "type": "Stock Alert",
            "priority": "High",
            "date": "31 Jul 2026",
            "time": "08:45 AM",
            "status": "Unread",
            "icon": "fa-box"
        },

        {
            "id": 4,
            "title": "New Prescription Added",
            "description": "New prescription added for patient Rahul Sharma (P1001).",
            "type": "Prescription",
            "priority": "Low",
            "date": "31 Jul 2026",
            "time": "08:20 AM",
            "status": "Read",
            "icon": "fa-clipboard-check"
        },

        {
            "id": 5,
            "title": "Appointment Reminder",
            "description": "Appointment with Priya Mehta (P1002) at 11:30 AM today.",
            "type": "Appointment",
            "priority": "Medium",
            "date": "31 Jul 2026",
            "time": "07:30 AM",
            "status": "Read",
            "icon": "fa-calendar"
        },

        {
            "id": 6,
            "title": "System Update",
            "description": "System backup completed successfully.",
            "type": "System",
            "priority": "Low",
            "date": "30 Jul 2026",
            "time": "11:45 PM",
            "status": "Read",
            "icon": "fa-circle-info"
        },

        {
            "id": 7,
            "title": "Daily Sales Report",
            "description": "Daily sales report for 30 Jul 2026 is now available.",
            "type": "Report",
            "priority": "Low",
            "date": "30 Jul 2026",
            "time": "09:00 PM",
            "status": "Read",
            "icon": "fa-chart-column"
        },

        {
            "id": 8,
            "title": "High Risk Fraud Alert",
            "description": "Suspicious claim detected for Claim ID: CLM2407001.",
            "type": "Fraud Alert",
            "priority": "High",
            "date": "30 Jul 2026",
            "time": "06:30 PM",
            "status": "Read",
            "icon": "fa-triangle-exclamation"
        }

    ]


    # =====================================================
    # NOTIFICATION COUNTS
    # =====================================================

    total_notifications = 32

    high_priority = 6

    pending_notifications = 8

    information_notifications = 12

    read_notifications = 14

    unread_count = 18

    high_priority_count = 6


    # =====================================================
    # NOTIFICATION SETTINGS
    # =====================================================

    notification_settings = {

        "expiry_alerts": True,

        "stock_alerts": True,

        "prescription_alerts": True,

        "appointment_reminders": True,

        "system_updates": True,

        "reports_analytics": True

    }


    # =====================================================
    # RENDER PAGE
    # =====================================================

    return render_template(
        "notifications/notifications.html",

        notifications=notifications_data,

        total_notifications=total_notifications,

        high_priority=high_priority,

        pending_notifications=pending_notifications,

        information_notifications=information_notifications,

        read_notifications=read_notifications,

        unread_count=unread_count,

        high_priority_count=high_priority_count,

        notification_settings=notification_settings
    )


# =========================================================
# SETTINGS
# =========================================================

@app.route("/settings")
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
        "address": "AI Smart Pharmacy, 123 Health Street, Medical Area, Mumbai, Maharashtra - 400001"
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


    return render_template(
        "settings/settings.html",

        profile=profile,

        system_preferences=system_preferences,

        application_settings=application_settings
    )


@app.route("/logout")

def logout():

    session.clear()

    return redirect(url_for("login"))


if __name__ == "__main__":

    with app.app_context():

        db.create_all()

        create_admin()

    app.run(debug=True)