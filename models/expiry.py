from database import db

class Expiry(db.Model):

    __tablename__ = "expiry"

    id = db.Column(db.Integer, primary_key=True)

    medicine_name = db.Column(db.String(100))

    batch_number = db.Column(db.String(50))

    expiry_date = db.Column(db.Date)

    days_left = db.Column(db.Integer)

    status = db.Column(db.String(30))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Expiry {self.medicine_name}>"