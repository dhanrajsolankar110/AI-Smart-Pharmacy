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
from database import db
from models.medicine import Medicine
from utils.data_loader import load_medicines_data


# ==========================================================
# BLUEPRINT
# ==========================================================

medicine_bp = Blueprint(
    "medicine",
    __name__
)


# ==========================================================
# HELPER
# ==========================================================

def calculate_status(quantity, reorder_level):
    """
    Automatically determine medicine stock status.
    """

    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        quantity = 0

    try:
        reorder_level = int(reorder_level)
    except (TypeError, ValueError):
        reorder_level = 0

    if quantity <= 0:
        return "Out of Stock"

    if quantity <= reorder_level:
        return "Low Stock"

    return "In Stock"


def parse_date(value):
    """
    Convert HTML date string (YYYY-MM-DD)
    into Python date object.
    """

    if not value:
        return None

    try:
        return datetime.strptime(
            value,
            "%Y-%m-%d"
        ).date()

    except ValueError:
        return None


# ==========================================================
# MEDICINES PAGE
# ==========================================================

@medicine_bp.route("/medicines")
@login_required
def medicines():

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
    # MEDICINE QUERY
    # ------------------------------------------------------

    pagination = (
        Medicine.query
        .order_by(
            Medicine.medicine_name.asc()
        )
        .paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
    )


    medicines = pagination.items


    # ------------------------------------------------------
    # SUMMARY COUNTS
    # ------------------------------------------------------

    total_medicines = (
        Medicine.query.count()
    )


    active_medicines = (
        Medicine.query
        .filter(
            Medicine.status == "In Stock"
        )
        .count()
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


    total_categories = (
        db.session.query(
            Medicine.category
        )
        .distinct()
        .count()
    )


    # ------------------------------------------------------
    # FILTER OPTIONS
    # ------------------------------------------------------

    categories = (
        db.session.query(
            Medicine.category
        )
        .distinct()
        .order_by(
            Medicine.category.asc()
        )
        .all()
    )


    manufacturers = (
        db.session.query(
            Medicine.manufacturer
        )
        .distinct()
        .order_by(
            Medicine.manufacturer.asc()
        )
        .all()
    )


    # ------------------------------------------------------
    # RENDER
    # ------------------------------------------------------

    return render_template(

        "medicines/medicines.html",

        medicines=medicines,

        pagination=pagination,

        total_medicines=total_medicines,

        active_medicines=active_medicines,

        low_stock=low_stock,

        out_of_stock=out_of_stock,

        total_categories=total_categories,

        categories=categories,

        manufacturers=manufacturers

    )

# ==========================================================
# ADD MEDICINE
# ==========================================================

@medicine_bp.route(
    "/add-medicine",
    methods=["POST"]
)
@login_required
def add_medicine():

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

        db.session.add(
            medicine
        )

        db.session.commit()

        flash(

            "Medicine added successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to add medicine: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "medicine.medicines"

        )

    )

# ==========================================================
# EDIT MEDICINE
# ==========================================================

@medicine_bp.route(
    "/edit-medicine/<int:id>",
    methods=["POST"]
)
@login_required
def edit_medicine(id):

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

        db.session.commit()

        flash(

            "Medicine updated successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to update medicine: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "medicine.medicines"

        )

    )

# ==========================================================
# DELETE MEDICINE
# ==========================================================

@medicine_bp.route(
    "/delete-medicine/<int:id>"
)
@login_required
def delete_medicine(id):

    medicine = Medicine.query.get_or_404(id)

    try:

        db.session.delete(medicine)

        db.session.commit()

        flash(

            "Medicine deleted successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to delete medicine: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "medicine.medicines"

        )

    )


# ==========================================================
# UPDATE STATUS
# ==========================================================

def refresh_medicine_status(medicine):
    """
    Refresh medicine stock status.
    """

    medicine.status = calculate_status(

        medicine.quantity,

        medicine.reorder_level

    )

    return medicine


# ==========================================================
# UPDATE ALL STOCK STATUS
# ==========================================================

@medicine_bp.route(
    "/refresh-medicine-status"
)
@login_required
def refresh_all_status():

    try:

        medicines = Medicine.query.all()

        for medicine in medicines:

            refresh_medicine_status(medicine)

        db.session.commit()

        flash(

            "Medicine stock status updated successfully.",

            "success"

        )

    except Exception as e:

        db.session.rollback()

        flash(

            f"Unable to refresh stock status: {str(e)}",

            "danger"

        )

    return redirect(

        url_for(

            "medicine.medicines"

        )

    )


# ==========================================================
# SEARCH MEDICINES
# ==========================================================

@medicine_bp.route(
    "/search-medicines"
)
@login_required
def search_medicines():

    keyword = request.args.get(

        "keyword",

        ""

    ).strip()

    medicines = (

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

            Medicine.manufacturer.ilike(

                f"%{keyword}%"

            )

        )

        .order_by(

            Medicine.medicine_name.asc()

        )

        .all()

    )

    return render_template(

        "medicines/medicines.html",

        medicines=medicines,

        total_medicines=Medicine.query.count(),

        active_medicines=Medicine.query.filter(

            Medicine.status == "In Stock"

        ).count(),

        low_stock=Medicine.query.filter(

            Medicine.status == "Low Stock"

        ).count(),

        out_of_stock=Medicine.query.filter(

            Medicine.status == "Out of Stock"

        ).count(),

        total_categories=db.session.query(

            Medicine.category

        ).distinct().count(),

        categories=db.session.query(

            Medicine.category

        ).distinct().order_by(

            Medicine.category.asc()

        ).all(),

        manufacturers=db.session.query(

            Medicine.manufacturer

        ).distinct().order_by(

            Medicine.manufacturer.asc()

        ).all()

    )

# ==========================================================
# IMAGE UPLOAD HELPERS
# ==========================================================

import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_IMAGE_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp"
}


def allowed_image(filename):

    if "." not in filename:
        return False

    extension = filename.rsplit(".", 1)[1].lower()

    return extension in ALLOWED_IMAGE_EXTENSIONS


def save_medicine_image(file):

    if not file:
        return None

    if file.filename == "":
        return None

    if not allowed_image(file.filename):
        return None

    filename = secure_filename(file.filename)

    extension = filename.rsplit(".", 1)[1].lower()

    filename = f"{uuid.uuid4().hex}.{extension}"

    upload_folder = os.path.join(

        current_app.root_path,

        "static",

        "uploads",

        "medicines"

    )

    os.makedirs(

        upload_folder,

        exist_ok=True

    )

    file.save(

        os.path.join(

            upload_folder,

            filename

        )

    )

    return filename


# ==========================================================
# DELETE OLD IMAGE
# ==========================================================

def delete_medicine_image(filename):

    if not filename:
        return

    try:

        image_path = os.path.join(

            current_app.root_path,

            "static",

            "uploads",

            "medicines",

            filename

        )

        if os.path.exists(image_path):

            os.remove(image_path)

    except Exception:

        pass


# ==========================================================
# UPDATE IMAGE
# ==========================================================

def update_medicine_image(

    medicine,

    uploaded_file

):

    if not uploaded_file:

        return

    filename = save_medicine_image(

        uploaded_file

    )

    if not filename:

        return

    if medicine.image:

        delete_medicine_image(

            medicine.image

        )

    medicine.image = filename


# ==========================================================
# FORM VALIDATION
# ==========================================================

def validate_medicine_form():

    required_fields = [

        "medicine_code",

        "medicine_name",

        "generic_name",

        "category",

        "manufacturer",

        "purchase_price",

        "selling_price",

        "quantity",

        "reorder_level",

        "unit",

        "expiry_date"

    ]

    for field in required_fields:

        if not request.form.get(field):

            flash(

                f"{field.replace('_',' ').title()} is required.",

                "danger"

            )

            return False

    return True