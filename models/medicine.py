"""
=========================================================
AI Smart Pharmacy & Healthcare Management System
Medicine Model
=========================================================
"""

from datetime import datetime

from database import db


class Medicine(db.Model):

    __tablename__ = "medicines"

    # =====================================================
    # PRIMARY KEY
    # =====================================================

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    # =====================================================
    # BASIC INFORMATION
    # =====================================================

    medicine_code = db.Column(
        db.String(20),
        unique=True,
        nullable=False
    )

    barcode = db.Column(
        db.String(100),
        unique=True
    )

    medicine_name = db.Column(
        db.String(150),
        nullable=False
    )

    generic_name = db.Column(
        db.String(150)
    )

    category = db.Column(
        db.String(100)
    )

    manufacturer = db.Column(
        db.String(150)
    )

    supplier = db.Column(
        db.String(150)
    )

    batch_number = db.Column(
        db.String(100)
    )

    # =====================================================
    # PRICE
    # =====================================================

    purchase_price = db.Column(
        db.Float,
        default=0
    )

    selling_price = db.Column(
        db.Float,
        default=0
    )

    # =====================================================
    # STOCK
    # =====================================================

    quantity = db.Column(
        db.Integer,
        default=0
    )

    reorder_level = db.Column(
        db.Integer,
        default=10
    )

    unit = db.Column(
        db.String(50),
        default="Tablet"
    )

    # =====================================================
    # DATES
    # =====================================================

    manufacture_date = db.Column(
        db.Date
    )

    expiry_date = db.Column(
        db.Date
    )

    # =====================================================
    # IMAGE
    # =====================================================

    image = db.Column(
        db.String(255),
        default="default_medicine.png"
    )

    # =====================================================
    # DESCRIPTION
    # =====================================================

    description = db.Column(
        db.Text
    )

    # =====================================================
    # STATUS
    # =====================================================

    status = db.Column(
        db.String(30),
        default="In Stock"
    )

    # =====================================================
    # TIMESTAMP
    # =====================================================

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # =====================================================
    # METHODS
    # =====================================================

    @property
    def stock_status(self):
        """
        Automatically determine stock status.
        """

        if self.quantity <= 0:
            return "Out of Stock"

        if self.quantity <= self.reorder_level:
            return "Low Stock"

        return "In Stock"

    @property
    def expiry_status(self):
        """
        Automatically determine expiry status.
        """

        if not self.expiry_date:
            return "Unknown"

        today = datetime.today().date()

        days = (self.expiry_date - today).days

        if days < 0:
            return "Expired"

        if days <= 30:
            return "Expiring Soon"

        return "Safe"

    @property
    def days_to_expiry(self):
        """
        Returns remaining days before expiry.
        """

        if not self.expiry_date:
            return None

        return (self.expiry_date - datetime.today().date()).days

    def update_status(self):
        """
        Update stock status before saving.
        """

        self.status = self.stock_status

    def to_dict(self):
        """
        Convert object to dictionary.
        """

        return {

            "id": self.id,

            "medicine_code": self.medicine_code,

            "barcode": self.barcode,

            "medicine_name": self.medicine_name,

            "generic_name": self.generic_name,

            "category": self.category,

            "manufacturer": self.manufacturer,

            "supplier": self.supplier,

            "batch_number": self.batch_number,

            "purchase_price": self.purchase_price,

            "selling_price": self.selling_price,

            "quantity": self.quantity,

            "reorder_level": self.reorder_level,

            "unit": self.unit,

            "manufacture_date": self.manufacture_date,

            "expiry_date": self.expiry_date,

            "image": self.image,

            "description": self.description,

            "status": self.status,

            "stock_status": self.stock_status,

            "expiry_status": self.expiry_status,

            "days_to_expiry": self.days_to_expiry,

            "created_at": self.created_at,

            "updated_at": self.updated_at

        }

    def __repr__(self):

        return f"<Medicine {self.medicine_name}>"