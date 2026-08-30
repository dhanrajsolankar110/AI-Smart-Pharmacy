"""
=========================================================
AI SMART PHARMACY
SETTINGS CSV -> SQLITE DATABASE IMPORTER
=========================================================

CSV:
    database/settings_data.csv

Database:
    database/pharmacy.db

Table:
    settings_data

Run:
    python -u "database/import_settings_to_db.py"

Purpose:
    Imports settings_data.csv into a dedicated SQLite table.
=========================================================
"""

from pathlib import Path
import sqlite3

import pandas as pd


# =========================================================
# PROJECT PATHS
# =========================================================

PROJECT_ROOT = (
    Path(__file__).resolve().parent.parent
)

CSV_FILE = (
    PROJECT_ROOT
    / "database"
    / "settings_data.csv"
)

DB_FILE = (
    PROJECT_ROOT
    / "database"
    / "pharmacy.db"
)


TABLE_NAME = "settings_data"


# =========================================================
# COLUMN NAME CLEANUP
# =========================================================

def clean_column_name(name):

    name = str(name).strip()

    name = (
        name
        .replace(" ", "_")
        .replace("-", "_")
        .replace("/", "_")
        .replace("(", "")
        .replace(")", "")
    )

    return name


# =========================================================
# MAIN
# =========================================================

def import_settings():

    print()
    print("=" * 65)
    print("AI SMART PHARMACY")
    print("SETTINGS CSV -> SQLITE DATABASE")
    print("=" * 65)
    print()


    # =====================================================
    # CHECK CSV
    # =====================================================

    if not CSV_FILE.exists():

        print(
            "ERROR: settings_data.csv was not found."
        )

        print()

        print(
            "Expected:"
        )

        print(
            CSV_FILE
        )

        print()

        return


    # =====================================================
    # READ CSV
    # =====================================================

    try:

        data = pd.read_csv(
            CSV_FILE
        )

    except Exception as error:

        print(
            "ERROR reading settings_data.csv"
        )

        print(
            f"Details: {error}"
        )

        return


    # =====================================================
    # CLEAN COLUMN NAMES
    # =====================================================

    data.columns = [
        clean_column_name(column)
        for column in data.columns
    ]


    print(
        f"CSV records found: {len(data)}"
    )

    print()

    print(
        "CSV columns:"
    )

    for column in data.columns:

        print(
            f"  - {column}"
        )

    print()


    # =====================================================
    # CONNECT TO SQLITE
    # =====================================================

    try:

        connection = sqlite3.connect(
            DB_FILE
        )

        cursor = connection.cursor()

    except Exception as error:

        print(
            "ERROR opening pharmacy.db"
        )

        print(
            f"Details: {error}"
        )

        return


    try:

        # =================================================
        # CREATE TABLE
        # =================================================

        column_definitions = []


        for column in data.columns:

            column_definitions.append(
                f'"{column}" TEXT'
            )


        create_sql = f"""
        CREATE TABLE IF NOT EXISTS "{TABLE_NAME}" (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            {", ".join(column_definitions)}

        )
        """


        cursor.execute(
            create_sql
        )


        # =================================================
        # CLEAR PREVIOUS IMPORT
        # =================================================

        cursor.execute(
            f'DELETE FROM "{TABLE_NAME}"'
        )


        # =================================================
        # INSERT DATA
        # =================================================

        columns_sql = ", ".join(
            f'"{column}"'
            for column in data.columns
        )


        placeholders = ", ".join(
            "?"
            for _ in data.columns
        )


        insert_sql = f"""
        INSERT INTO "{TABLE_NAME}"
        ({columns_sql})
        VALUES ({placeholders})
        """


        imported = 0


        for _, row in data.iterrows():

            values = []


            for column in data.columns:

                value = row[column]


                if pd.isna(value):

                    value = None

                else:

                    value = str(value)


                values.append(
                    value
                )


            cursor.execute(
                insert_sql,
                values
            )


            imported += 1


            if imported % 100 == 0:

                connection.commit()

                print(
                    f"Imported {imported} settings records..."
                )


        # =================================================
        # FINAL COMMIT
        # =================================================

        connection.commit()


        # =================================================
        # VERIFY
        # =================================================

        cursor.execute(
            f'SELECT COUNT(*) FROM "{TABLE_NAME}"'
        )


        count = cursor.fetchone()[0]


        print()
        print("=" * 65)
        print("IMPORT COMPLETED")
        print("=" * 65)

        print(
            f"CSV records  : {len(data)}"
        )

        print(
            f"Imported     : {imported}"
        )

        print(
            f"Database rows: {count}"
        )

        print()

        print(
            f"SQLite table: {TABLE_NAME}"
        )

        print("=" * 65)


    except Exception as error:

        connection.rollback()

        print()
        print(
            "ERROR during database import:"
        )

        print(
            f"Details: {error}"
        )

    finally:

        connection.close()


# =========================================================
# ENTRY POINT
# =========================================================

if __name__ == "__main__":

    import_settings()