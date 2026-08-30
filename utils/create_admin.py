from werkzeug.security import generate_password_hash

from database import db
from models.user import User


def create_admin():

    # ======================================================
    # CHECK IF ADMIN ALREADY EXISTS
    # ======================================================

    admin = User.query.filter_by(
        role="Administrator"
    ).first()


    if admin:

        # --------------------------------------------------
        # Update existing administrator
        # --------------------------------------------------

        admin.full_name = "Admin User"

        admin.email = "admin"

        admin.password = generate_password_hash(
            "admin"
        )

        admin.role = "Administrator"

        db.session.commit()

        print("✓ Admin user updated.")

        return


    # ======================================================
    # CREATE DEFAULT ADMIN
    # ======================================================

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


    print("✓ Default admin created.")