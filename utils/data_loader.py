import pandas as pd
from pathlib import Path


# =========================================================
# DATA DIRECTORY
# =========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "database"


# =========================================================
# GENERIC CSV LOADER
# =========================================================

def load_csv(filename):

    file_path = DATA_DIR / filename

    if not file_path.exists():
        return pd.DataFrame()

    try:
        return pd.read_csv(file_path)

    except Exception as e:
        print(f"Error loading {filename}: {e}")
        return pd.DataFrame()


# =========================================================
# DASHBOARD
# =========================================================

def load_dashboard_data():
    return load_csv("dashboard_data.csv")


# =========================================================
# MEDICINES
# =========================================================

def load_medicines_data():
    return load_csv("medicines_data.csv")


# =========================================================
# STOCK
# =========================================================

def load_stock_data():
    return load_csv("stock_data.csv")


# =========================================================
# EXPIRY
# =========================================================

def load_expiry_data():
    return load_csv("expiry_data.csv")


# =========================================================
# REPORTS
# =========================================================

def load_reports_data():
    return load_csv("reports_data.csv")


# =========================================================
# PATIENTS
# =========================================================

def load_patients_data():
    return load_csv("patients_data.csv")


# =========================================================
# PRESCRIPTIONS
# =========================================================

def load_prescriptions_data():
    return load_csv("prescriptions_data.csv")


# =========================================================
# NOTIFICATIONS
# =========================================================

def load_notifications_data():
    return load_csv("notifications_data.csv")


# =========================================================
# SETTINGS
# =========================================================

def load_settings_data():
    return load_csv("settings_data.csv")