from database import db

class Prescription(db.Model):

    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)

    prescription_code = db.Column(db.String(20), unique=True)

    patient_name = db.Column(db.String(100))

    doctor_name = db.Column(db.String(100))

    medicine = db.Column(db.String(150))

    amount = db.Column(db.Float)

    status = db.Column(db.String(30))

    prescription_date = db.Column(db.Date)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Prescription {self.prescription_code}>"