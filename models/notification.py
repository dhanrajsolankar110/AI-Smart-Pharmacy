from database import db

class Notification(db.Model):

    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(150))

    category = db.Column(db.String(50))

    status = db.Column(db.String(30))

    message = db.Column(db.Text)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Notification {self.title}>"