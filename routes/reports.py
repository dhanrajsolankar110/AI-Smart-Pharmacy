from flask import (
    Blueprint,
    render_template,
    request,
    url_for,
    redirect
)

from datetime import date, timedelta

from database import db
from utils.auth import login_required
from models.medicine import Medicine
from utils.data_loader import load_reports_data


# ==========================================================
# BLUEPRINT
# ==========================================================

reports_bp = Blueprint(
    "reports",
    __name__
)


# ==========================================================
# REPORTS & ANALYTICS
# ==========================================================

@reports_bp.route(
    "/reports"
)
@login_required
def reports():

    # ======================================================
    # DATE RANGE
    # ======================================================

    try:

        days = int(
            request.args.get(
                "days",
                30
            )
        )

    except (
        TypeError,
        ValueError
    ):

        days = 30


    if days not in [7, 30, 90, 365]:

        days = 30


    end_date = date.today()

    start_date = (
        end_date -
        timedelta(
            days=days - 1
        )
    )


    # ======================================================
    # MEDICINE DATA
    # ======================================================

    medicines = Medicine.query.all()


    # ======================================================
    # INVENTORY STATISTICS
    # ======================================================

    total_medicines = len(
        medicines
    )


    total_stock_quantity = sum(

        int(
            medicine.quantity or 0
        )

        for medicine in medicines

    )


    low_stock_count = sum(

        1

        for medicine in medicines

        if (
            int(
                medicine.quantity or 0
            )
            <=
            int(
                medicine.reorder_level or 0
            )
        )

    )


    out_of_stock_count = sum(

        1

        for medicine in medicines

        if int(
            medicine.quantity or 0
        ) <= 0

    )


    in_stock_count = (
        total_medicines
        -
        low_stock_count
    )


    if in_stock_count < 0:

        in_stock_count = 0


    # ======================================================
    # STOCK ALERTS
    # ======================================================

    stock_alerts = (
        low_stock_count
        +
        out_of_stock_count
    )


    # ======================================================
    # BASIC REPORT DATA
    #
    # Sales and patient totals will be connected to their
    # respective database models when those modules exist.
    # ======================================================

    total_sales = 0

    total_medicines_sold = 0

    total_patients = 0


    # ======================================================
    # STOCK STATUS PERCENTAGES
    # ======================================================

    if total_medicines > 0:

        in_stock_percentage = round(

            (
                in_stock_count
                /
                total_medicines
            )
            * 100,

            1

        )

        low_stock_percentage = round(

            (
                low_stock_count
                /
                total_medicines
            )
            * 100,

            1

        )

        out_stock_percentage = round(

            (
                out_of_stock_count
                /
                total_medicines
            )
            * 100,

            1

        )

    else:

        in_stock_percentage = 0

        low_stock_percentage = 0

        out_stock_percentage = 0


    return render_template(

        "reports/reports.html",

        # Date range

        selected_days=days,

        start_date=start_date,

        end_date=end_date,

        # Summary

        total_sales=total_sales,

        total_medicines_sold=
            total_medicines_sold,

        total_patients=
            total_patients,

        stock_alerts=
            stock_alerts,

        # Inventory

        total_medicines=
            total_medicines,

        total_stock_quantity=
            total_stock_quantity,

        low_stock_count=
            low_stock_count,

        out_of_stock_count=
            out_of_stock_count,

        in_stock_count=
            in_stock_count,

        # Percentages

        in_stock_percentage=
            in_stock_percentage,

        low_stock_percentage=
            low_stock_percentage,

        out_stock_percentage=
            out_stock_percentage

    )

# ==========================================================
# TOP SELLING MEDICINES
# ==========================================================

def get_top_selling_medicines():

    """
    Returns the medicines that should appear in the
    Top Selling Medicines section.

    Your current Medicine model does not contain a
    sales-history / quantity-sold field, so we do not
    invent sales data here.

    For now, medicines are returned using their current
    inventory information.
    """

    medicines = Medicine.query.all()

    top_medicines = []

    for medicine in medicines:

        quantity = int(
            medicine.quantity or 0
        )

        selling_price = float(
            medicine.selling_price or 0
        )

        estimated_value = (
            quantity *
            selling_price
        )

        top_medicines.append({

            "medicine":
                medicine,

            "quantity_sold":
                0,

            "revenue":
                0,

            "stock_quantity":
                quantity,

            "selling_price":
                selling_price,

            "estimated_value":
                estimated_value

        })


    # ======================================================
    # SORT BY CURRENT STOCK VALUE
    #
    # This is NOT sales data.
    # It is only used temporarily for displaying medicines
    # until a sales model exists.
    # ======================================================

    top_medicines.sort(

        key=lambda item:
            item["estimated_value"],

        reverse=True

    )


    return top_medicines[:5]


# ==========================================================
# MEDICINE CATEGORY DATA
# ==========================================================

def get_category_data():

    medicines = Medicine.query.all()

    category_totals = {}


    for medicine in medicines:

        category = (
            medicine.category
            or "Others"
        )

        category = category.strip()

        if not category:

            category = "Others"


        if category not in category_totals:

            category_totals[category] = 0


        quantity = int(
            medicine.quantity or 0
        )

        category_totals[
            category
        ] += quantity


    # ======================================================
    # SORT CATEGORIES
    # ======================================================

    sorted_categories = sorted(

        category_totals.items(),

        key=lambda item:
            item[1],

        reverse=True

    )


    # ======================================================
    # LIMIT TO FIVE DISPLAY CATEGORIES
    # ======================================================

    category_data = []

    for category, quantity in sorted_categories[:5]:

        category_data.append({

            "category":
                category,

            "quantity":
                quantity

        })


    return category_data


# ==========================================================
# SALES TREND DATA
# ==========================================================

def get_sales_trend():

    """
    Current project does not have a sales transaction model
    available in the Medicine model.

    Therefore this returns an empty list rather than fake
    sales figures.
    """

    return []


# ==========================================================
# RECENT ACTIVITIES
# ==========================================================

def get_recent_activities():

    """
    Creates inventory-related activities from the current
    Medicine table.

    These are real inventory conditions, not fabricated
    sales transactions.
    """

    medicines = Medicine.query.all()

    activities = []


    # ======================================================
    # LOW STOCK ACTIVITIES
    # ======================================================

    for medicine in medicines:

        quantity = int(
            medicine.quantity or 0
        )

        reorder_level = int(
            medicine.reorder_level or 0
        )


        if quantity <= 0:

            activities.append({

                "type":
                    "stock",

                "title":
                    (
                        "Out of stock: "
                        +
                        str(
                            medicine.medicine_name
                            or "Medicine"
                        )
                    ),

                "description":
                    "No units currently available",

                "time":
                    "Current"

            })


        elif quantity <= reorder_level:

            activities.append({

                "type":
                    "stock",

                "title":
                    (
                        "Low stock: "
                        +
                        str(
                            medicine.medicine_name
                            or "Medicine"
                        )
                    ),

                "description":
                    (
                        f"{quantity} units remaining"
                    ),

                "time":
                    "Current"

            })


    # ======================================================
    # EXPIRY ACTIVITIES
    # ======================================================

    today = date.today()

    for medicine in medicines:

        if not medicine.expiry_date:

            continue


        days_left = (
            medicine.expiry_date
            - today
        ).days


        if 0 <= days_left <= 30:

            activities.append({

                "type":
                    "expiry",

                "title":
                    (
                        "Expiry approaching: "
                        +
                        str(
                            medicine.medicine_name
                            or "Medicine"
                        )
                    ),

                "description":
                    (
                        f"Expires in {days_left} days"
                    ),

                "time":
                    "Upcoming"

            })


        elif days_left < 0:

            activities.append({

                "type":
                    "expiry",

                "title":
                    (
                        "Expired: "
                        +
                        str(
                            medicine.medicine_name
                            or "Medicine"
                        )
                    ),

                "description":
                    "Medicine has expired",

                "time":
                    "Attention"

            })


    return activities[:5]

# ==========================================================
# REPORT DATA API
# ==========================================================

@reports_bp.route(
    "/reports/data"
)
@login_required
def reports_data():

    try:

        days = int(
            request.args.get(
                "days",
                30
            )
        )

    except (
        TypeError,
        ValueError
    ):

        days = 30


    if days not in [7, 30, 90, 365]:

        days = 30


    # ======================================================
    # INVENTORY DATA
    # ======================================================

    medicines = Medicine.query.all()

    total_medicines = len(
        medicines
    )

    total_stock_quantity = sum(

        int(
            medicine.quantity or 0
        )

        for medicine in medicines

    )


    low_stock_count = sum(

        1

        for medicine in medicines

        if (
            int(
                medicine.quantity or 0
            )
            <=
            int(
                medicine.reorder_level or 0
            )
        )

    )


    out_of_stock_count = sum(

        1

        for medicine in medicines

        if int(
            medicine.quantity or 0
        ) <= 0

    )


    in_stock_count = (
        total_medicines
        -
        low_stock_count
    )


    if in_stock_count < 0:

        in_stock_count = 0


    stock_alerts = (
        low_stock_count
        +
        out_of_stock_count
    )


    # ======================================================
    # STOCK PERCENTAGES
    # ======================================================

    if total_medicines > 0:

        in_stock_percentage = round(

            (
                in_stock_count
                /
                total_medicines
            ) * 100,

            1

        )

        low_stock_percentage = round(

            (
                low_stock_count
                /
                total_medicines
            ) * 100,

            1

        )

        out_stock_percentage = round(

            (
                out_of_stock_count
                /
                total_medicines
            ) * 100,

            1

        )

    else:

        in_stock_percentage = 0

        low_stock_percentage = 0

        out_stock_percentage = 0


    # ======================================================
    # CATEGORY DATA
    # ======================================================

    category_data = (
        get_category_data()
    )


    # ======================================================
    # TOP MEDICINES
    # ======================================================

    top_medicines = (
        get_top_selling_medicines()
    )


    # ======================================================
    # RECENT ACTIVITIES
    # ======================================================

    recent_activities = (
        get_recent_activities()
    )


    # ======================================================
    # RESPONSE
    # ======================================================

    return {

        "success":
            True,

        "days":
            days,

        "total_sales":
            0,

        "total_medicines_sold":
            0,

        "total_patients":
            0,

        "stock_alerts":
            stock_alerts,

        "total_medicines":
            total_medicines,

        "total_stock_quantity":
            total_stock_quantity,

        "in_stock_count":
            in_stock_count,

        "low_stock_count":
            low_stock_count,

        "out_of_stock_count":
            out_of_stock_count,

        "in_stock_percentage":
            in_stock_percentage,

        "low_stock_percentage":
            low_stock_percentage,

        "out_stock_percentage":
            out_stock_percentage,

        "category_data": [

            {

                "category":
                    item["category"],

                "quantity":
                    item["quantity"]

            }

            for item in category_data

        ],

        "top_medicines": [

            {

                "medicine_name":
                    item[
                        "medicine"
                    ].medicine_name
                    or "",

                "category":
                    item[
                        "medicine"
                    ].category
                    or "Others",

                "quantity_sold":
                    item[
                        "quantity_sold"
                    ],

                "revenue":
                    item[
                        "revenue"
                    ]

            }

            for item in top_medicines

        ],

        "recent_activities":
            recent_activities

    }


# ==========================================================
# REFRESH REPORTS
# ==========================================================

@reports_bp.route(
    "/reports/refresh"
)
@login_required
def refresh_reports():

    return redirect(
        url_for(
            "reports.reports"
        )
    )


# ==========================================================
# END OF REPORTS ROUTES
# ==========================================================