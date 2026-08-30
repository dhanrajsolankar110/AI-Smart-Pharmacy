from flask import Blueprint
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import flash
from flask import session

from werkzeug.security import check_password_hash

from database import db
from models.user import User

auth_bp = Blueprint(
    "auth",
    __name__
)

@auth_bp.route("/", methods=["GET","POST"])

def login():

    if request.method == "POST":

        email = request.form.get("email")

        password = request.form.get("password")

        user = User.query.filter_by(
            email=email
        ).first()

        if user and check_password_hash(
            user.password,
            password
        ):

            session["user_id"] = user.id

            session["user_name"] = user.full_name

            session["role"] = user.role

            flash(
                "Login Successful!",
                "success"
            )

            return redirect(
                url_for("dashboard")
            )

        flash(
            "Invalid Username or Password",
            "error"
        )

    return render_template(
        "auth/login.html"
    )

@auth_bp.route("/logout")

def logout():

    session.clear()

    flash(
        "Logged Out Successfully",
        "success"
    )

    return redirect(
        url_for("auth.login")
    )