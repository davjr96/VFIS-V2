from flask_sqlalchemy import SQLAlchemy
from itsdangerous import (JSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from passlib.apps import custom_app_context as pwd_context

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))
    first_name = db.Column(db.String())
    middle_name = db.Column(db.String())
    last_name = db.Column(db.String())
    organization = db.Column(db.String())
    title = db.Column(db.String())
    subject_areas = db.Column(db.String())
    role = db.Column(db.String())
    country = db.Column(db.String())
    state_province = db.Column(db.String())
    phone_number = db.Column(db.String())
    website = db.Column(db.String())

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration = None):
        s = Serializer("dfjkahfjkldahfajklhdlash")
        return s.dumps({ 'id': self.id })

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    @staticmethod
    def verify_auth_token(token):
        s = Serializer("dfjkahfjkldahfajklhdlash")
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['id'])
        return user


class Constructions(db.Model):
    __tablename__ = 'constructions'
    fedid = db.Column(db.String, primary_key=True)
    roadname = db.Column(db.String)
    xcord = db.Column(db.Float)
    ycord = db.Column(db.Float)
    stream = db.Column(db.String)
    roadelev = db.Column(db.Float)
    forecasts = db.relationship("Forecast")

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}



class Forecast(db.Model):
    __tablename__ = 'forecasts'
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.String)
    maxwl = db.Column(db.Float)
    floodedby = db.Column(db.Float)
    end_date = db.Column(db.String)
    construction_fed_id = db.Column(
        db.Integer, db.ForeignKey('constructions.fedid'))
    run_date_time = db.Column(db.String)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}
