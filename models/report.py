from database import db

class Report(db.Model):

    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)

    report_name = db.Column(db.String(150))

    report_type = db.Column(db.String(50))

    generated_by = db.Column(db.String(100))

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Report {self.report_name}>"