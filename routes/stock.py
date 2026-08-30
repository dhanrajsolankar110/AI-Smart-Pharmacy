from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from datetime import datetime

from database import db
from utils.auth import login_required
from models.medicine import Medicine
from utils.data_loader import load_stock_data


# ==========================================================
# BLUEPRINT
# ==========================================================

stock_bp = Blueprint(

    "stock",

    __name__

)


# ==========================================================
# HELPER FUNCTIONS
# ==========================================================

def calculate_status(quantity, reorder_level):

    try:

        quantity = int(quantity)

    except:

        quantity = 0

    try:

        reorder_level = int(reorder_level)

    except:

        reorder_level = 0

    if quantity <= 0:

        return "Out of Stock"

    elif quantity <= reorder_level:

        return "Low Stock"

    return "In Stock"


def parse_date(value):

    if not value:

        return None

    try:

        return datetime.strptime(

            value,

            "%Y-%m-%d"

        ).date()

    except:

        return None


# ==========================================================
# STOCK PAGE
# ==========================================================

@stock_bp.route("/stock")
@login_required
def stock():

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
    # ------------------------------------------------------

    stock_query = (
        Medicine.query
        .order_by(
            Medicine.medicine_name.asc()
        )
    )


    # ------------------------------------------------------
    # PAGINATION
    # ------------------------------------------------------

    pagination = stock_query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )


    # Only 10 records for the current page
    stocks = pagination.items


    # ------------------------------------------------------
    # SUMMARY COUNTS
    # ------------------------------------------------------

    total_stock = (
        Medicine.query.count()
    )


    low_stock = (
        Medicine.query
        .filter(
            Medicine.status == "Low Stock"
        )
        .count()
    )


    out_of_stock = (
        Medicine.query
        .filter(
            Medicine.status == "Out of Stock"
        )
        .count()
    )


    # ------------------------------------------------------
    # TOTAL STOCK VALUE
    # ------------------------------------------------------

    all_medicines = (
        Medicine.query.all()
    )


    stock_value = sum(
        (
            float(item.purchase_price or 0)
            *
            int(item.quantity or 0)
        )
        for item in all_medicines
    )


    # ------------------------------------------------------
    # CATEGORIES
    # ------------------------------------------------------

    categories = (
        db.session.query(
            Medicine.category
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
        "stock/stock.html",

        stocks=stocks,

        pagination=pagination,

        total_stock=total_stock,

        low_stock=low_stock,

        out_of_stock=out_of_stock,

        stock_value=round(
            stock_value,
            2
        ),

        categories=categories
    )

# ==========================================================
# ADD STOCK
# ==========================================================

@stock_bp.route(
    "/add-stock",
    methods=["POST"]
)
@login_required
def add_stock():

    try:

        quantity = int(
            request.form.get(
                "quantity",
                0
            )
        )

        reorder_level = int(
            request.form.get(
                "reorder_level",
                0
            )
        )

        status = calculate_status(

            quantity,

            reorder_level

        )

        medicine = Medicine(

            medicine_code=request.form.get(
                "medicine_code"
            ),

            barcode=request.form.get(
                "barcode"
            ),

            medicine_name=request.form.get(
                "medicine_name"
            ),

            generic_name=request.form.get(
                "generic_name"
            ),

            category=request.form.get(
                "category"
            ),

            manufacturer=request.form.get(
                "manufacturer"
            ),

            supplier=request.form.get(
                "supplier"
            ),

            batch_number=request.form.get(
                "batch_number"
            ),

            purchase_price=float(
                request.form.get(
                    "purchase_price",
                    0
                )
            ),

            selling_price=float(
                request.form.get(
                    "selling_price",
                    0
                )
            ),

            quantity=quantity,

            reorder_level=reorder_level,

            unit=request.form.get(
                "unit"
            ),

            manufacture_date=parse_date(
                request.form.get(
                    "manufacture_date"
                )
            ),

            expiry_date=parse_date(
                request.form.get(
                    "expiry_date"
                )
            ),

            description=request.form.get(
                "description"
            ),

            status=status

        )

        # ==============================================
        # IMAGE UPLOAD
        # ==============================================

        image = request.files.get("image")

        if image and image.filename:

            from werkzeug.utils import secure_filename
            import os
            import uuid

            extension = image.filename.rsplit(
                ".",
                1
            )[1].lower()

            filename = (

                str(uuid.uuid4())

                + "."

                + extension

            )

            upload_folder = os.path.join(

                "static",

                "uploads",

                "medicines"

            )

            os.makedirs(

                upload_folder,

                exist_ok=True

            )

            image.save(

                os.path.join(

                    upload_folder,

                    filename

                )

            )

            medicine.image = filename

        db.session.add(

            medicine

        )

        db.session.commit()

        flash(

            "Stock added successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to add stock: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "stock.stock"

        )

    )

# ==========================================================
# EDIT STOCK
# ==========================================================

@stock_bp.route(
    "/edit-stock/<int:id>",
    methods=["POST"]
)
@login_required
def edit_stock(id):

    medicine = Medicine.query.get_or_404(id)

    try:

        quantity = int(

            request.form.get(

                "quantity",

                0

            )

        )

        reorder_level = int(

            request.form.get(

                "reorder_level",

                0

            )

        )

        medicine.barcode = request.form.get(

            "barcode"

        )

        medicine.medicine_name = request.form.get(

            "medicine_name"

        )

        medicine.generic_name = request.form.get(

            "generic_name"

        )

        medicine.category = request.form.get(

            "category"

        )

        medicine.manufacturer = request.form.get(

            "manufacturer"

        )

        medicine.supplier = request.form.get(

            "supplier"

        )

        medicine.batch_number = request.form.get(

            "batch_number"

        )

        medicine.purchase_price = float(

            request.form.get(

                "purchase_price",

                0

            )

        )

        medicine.selling_price = float(

            request.form.get(

                "selling_price",

                0

            )

        )

        medicine.quantity = quantity

        medicine.reorder_level = reorder_level

        medicine.unit = request.form.get(

            "unit"

        )

        medicine.manufacture_date = parse_date(

            request.form.get(

                "manufacture_date"

            )

        )

        medicine.expiry_date = parse_date(

            request.form.get(

                "expiry_date"

            )

        )

        medicine.description = request.form.get(

            "description"

        )

        medicine.status = calculate_status(

            quantity,

            reorder_level

        )

        # ==================================================
        # UPDATE IMAGE
        # ==================================================

        image = request.files.get("image")

        if image and image.filename:

            from werkzeug.utils import secure_filename
            import os
            import uuid

            extension = image.filename.rsplit(

                ".",

                1

            )[1].lower()

            filename = (

                str(uuid.uuid4())

                + "."

                + extension

            )

            upload_folder = os.path.join(

                "static",

                "uploads",

                "medicines"

            )

            os.makedirs(

                upload_folder,

                exist_ok=True

            )

            image.save(

                os.path.join(

                    upload_folder,

                    filename

                )

            )

            medicine.image = filename

        db.session.commit()

        flash(

            "Stock updated successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to update stock: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "stock.stock"

        )

    )

# ==========================================================
# DELETE STOCK
# ==========================================================

@stock_bp.route(
    "/delete-stock/<int:id>",
    methods=["POST"]
)
@login_required
def delete_stock(id):

    medicine = Medicine.query.get_or_404(id)

    try:

        db.session.delete(medicine)

        db.session.commit()

        flash(

            "Stock deleted successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to delete stock: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "stock.stock"

        )

    )


# ==========================================================
# SEARCH STOCK
# ==========================================================

@stock_bp.route("/search-stock")
@login_required
def search_stock():

    keyword = request.args.get(

        "keyword",

        ""

    ).strip()

    stocks = (

        Medicine.query.filter(

            Medicine.medicine_name.ilike(

                f"%{keyword}%"

            )

            |

            Medicine.generic_name.ilike(

                f"%{keyword}%"

            )

            |

            Medicine.category.ilike(

                f"%{keyword}%"

            )

            |

            Medicine.batch_number.ilike(

                f"%{keyword}%"

            )

        )

        .order_by(

            Medicine.medicine_name.asc()

        )

        .all()

    )

    stock_value = sum(

        float(item.purchase_price) *

        int(item.quantity)

        for item in stocks

    )

    return render_template(

        "stock/stock.html",

        stocks=stocks,

        total_stock=len(stocks),

        low_stock=len(

            [

                s for s in stocks

                if s.status == "Low Stock"

            ]

        ),

        out_of_stock=len(

            [

                s for s in stocks

                if s.status == "Out of Stock"

            ]

        ),

        stock_value=round(

            stock_value,

            2

        ),

        categories=(

            db.session.query(

                Medicine.category

            )

            .distinct()

            .order_by(

                Medicine.category

            )

            .all()

        )

    )


# ==========================================================
# REFRESH STOCK STATUS
# ==========================================================

@stock_bp.route("/refresh-stock-status")
@login_required
def refresh_stock_status():

    medicines = Medicine.query.all()

    try:

        for medicine in medicines:

            medicine.status = calculate_status(

                medicine.quantity,

                medicine.reorder_level

            )

        db.session.commit()

        flash(

            "Stock status updated successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to refresh stock: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "stock.stock"

        )

    )


# ==========================================================
# END OF STOCK ROUTES
# ==========================================================