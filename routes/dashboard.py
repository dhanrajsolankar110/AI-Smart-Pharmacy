from datetime import datetime, date

from flask import Blueprint, render_template, url_for

from utils.auth import login_required

from models.medicine import Medicine
from models.patient import Patient
from models.prescription import Prescription


dashboard_bp = Blueprint(
    "dashboard",
    __name__
)


@dashboard_bp.route("/dashboard")
@login_required
def dashboard():

    # ==========================================================
    # BASIC COUNTS
    # ==========================================================

    total_medicines = Medicine.query.count()

    total_patients = Patient.query.count()

    total_prescriptions = Prescription.query.count()


    # ==========================================================
    # STOCK COUNTS
    # ==========================================================

    low_stock = Medicine.query.filter(
        Medicine.status == "Low Stock"
    ).count()

    out_of_stock = Medicine.query.filter(
        Medicine.status == "Out of Stock"
    ).count()


    # ==========================================================
    # EXPIRY COUNT
    # ==========================================================

    expiring_soon = Medicine.query.filter(
        Medicine.status == "Expiring Soon"
    ).count()


    # ==========================================================
    # STOCK STATUS
    # ==========================================================

    in_stock = max(
        total_medicines - low_stock - out_of_stock,
        0
    )

    stock_total = (
        in_stock +
        low_stock +
        out_of_stock
    )

    if stock_total > 0:

        in_stock_percent = round(
            (in_stock / stock_total) * 100,
            1
        )

        low_stock_percent = round(
            (low_stock / stock_total) * 100,
            1
        )

        out_of_stock_percent = round(
            (out_of_stock / stock_total) * 100,
            1
        )

    else:

        in_stock_percent = 0
        low_stock_percent = 0
        out_of_stock_percent = 0


    # ==========================================================
    # RECENT MEDICINES
    # ==========================================================

    recent_medicines = (
        Medicine.query
        .order_by(
            Medicine.created_at.desc()
        )
        .limit(5)
        .all()
    )


    # ==========================================================
    # EXPIRY ALERTS
    #
    # These are the same visual records shown in your reference
    # dashboard. Later they can be connected directly to the
    # expiry table.
    # ==========================================================

    expiry_alerts = [

        {
            "name": "Paracetamol 500mg",
            "days": 5,
            "quantity": "25 strips",
            "status": "Critical",
            "type": "critical"
        },

        {
            "name": "Amoxicillin 250mg",
            "days": 12,
            "quantity": "18 bottles",
            "status": "Warning",
            "type": "warning"
        },

        {
            "name": "Cetirizine 10mg",
            "days": 18,
            "quantity": "32 strips",
            "status": "Warning",
            "type": "warning"
        },

        {
            "name": "Ibuprofen 400mg",
            "days": 28,
            "quantity": "15 strips",
            "status": "Info",
            "type": "info"
        }

    ]


    # ==========================================================
    # RECENT ACTIVITIES
    # ==========================================================

    activities = [

        {
            "icon": "fa-prescription-bottle-medical",
            "text": "New medicine added: Azithromycin 500mg",
            "time": "2 hours ago",
            "color": "purple"
        },

        {
            "icon": "fa-box",
            "text": "Stock updated for Paracetamol 500mg",
            "time": "4 hours ago",
            "color": "green"
        },

        {
            "icon": "fa-file-prescription",
            "text": "New prescription created for Rahul Sharma",
            "time": "6 hours ago",
            "color": "red"
        }

    ]


    # ==========================================================
    # QUICK STATS
    # ==========================================================

    quick_stats = {

        "today_sales": 12450,

        "sales_growth": 8.2,

        "today_prescriptions": 24,

        "prescription_growth": 3

    }


    # ==========================================================
    # DASHBOARD DATE
    # ==========================================================

    dashboard_date = datetime.now().strftime(
        "%d %B %Y, %A"
    )


    # ==========================================================
    # RENDER
    # ==========================================================

    return render_template(

        "dashboard/dashboard.html",

        total_medicines=total_medicines,

        total_patients=total_patients,

        total_prescriptions=total_prescriptions,

        low_stock=low_stock,

        expiring_soon=expiring_soon,

        out_of_stock=out_of_stock,

        in_stock=in_stock,

        stock_total=stock_total,

        in_stock_percent=in_stock_percent,

        low_stock_percent=low_stock_percent,

        out_of_stock_percent=out_of_stock_percent,

        recent_medicines=recent_medicines,

        expiry_alerts=expiry_alerts,

        activities=activities,

        quick_stats=quick_stats,

        dashboard_date=dashboard_date

    )