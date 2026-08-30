from database import db

class Stock(db.Model):

    __tablename__ = "stock"

    id = db.Column(db.Integer, primary_key=True)

    medicine_name = db.Column(db.String(100))

    supplier = db.Column(db.String(100))

    quantity = db.Column(db.Integer)

    reorder_level = db.Column(db.Integer)

    status = db.Column(db.String(30))

    updated_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Stock {self.medicine_name}>"