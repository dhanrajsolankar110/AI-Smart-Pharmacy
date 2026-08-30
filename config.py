import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:

    SECRET_KEY = "AI_SMART_PHARMACY_SECRET_KEY_2026"

    SQLALCHEMY_DATABASE_URI = \
        "sqlite:///" + os.path.join(BASE_DIR, "database", "pharmacy.db")

    SQLALCHEMY_TRACK_MODIFICATIONS = False