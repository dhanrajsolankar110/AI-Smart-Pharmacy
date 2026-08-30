from database import db

class Patient(db.Model):

    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)

    patient_code = db.Column(db.String(20), unique=True)

    full_name = db.Column(db.String(100), nullable=False)

    age = db.Column(db.Integer)

    gender = db.Column(db.String(20))

    phone = db.Column(db.String(20))

    address = db.Column(db.String(200))

    blood_group = db.Column(db.String(10))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Patient {self.full_name}>"