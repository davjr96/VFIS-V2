from flask import Flask, jsonify, render_template, Response, request,g, url_for, abort
import constants
import simplekml
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

# Set Up Flask Constants and Login
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] =  "postgres://"+constants.user+":"+constants.password+"@"+constants.host+":5432/postgres"
app.config['SECRET_KEY'] = 'dfjkahfjkldahfajklhdlash'
app.debug = True

db = SQLAlchemy(app)
auth = HTTPBasicAuth()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user

@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@app.route('/api/users', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return (jsonify({'username': user.username}), 201,
            {'Location': url_for('get_user', id=user.id, _external=True)})


@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})


@app.route('/api/login')
@auth.login_required
def get_auth_token():
    return jsonify({"status": "OK"}), 200


@app.route('/api/resource')
@auth.login_required
def get_resource():
    return jsonify({'data': 'Hello, %s!' % g.user.username})

class Structure(db.Model):
    __tablename__ = 'bridges'
    id = db.Column(db.Integer, primary_key=True)
    roadname = db.Column(db.String)
    xcord = db.Column(db.Float)
    ycord = db.Column(db.Float)
    stream = db.Column(db.String)
    roadelev = db.Column(db.Float)
    date = db.Column(db.String)
    maxwl = db.Column(db.Float)
    floodedby = db.Column(db.Float)
    fedid = db.Column(db.String)
    starttime = db.Column(db.String)
    endtime = db.Column(db.String)

    def to_json(self):
        return dict(id=self.id,
                    xcord=self.xcord,
                    ycord=self.ycord,
                    roadname=self.roadname,
                    stream=self.stream,
                    roadelev=self.roadelev,
                    date=self.date,
                    maxwl=self.maxwl,
                    floodedby=self.floodedby,
                    fedid=self.fedid,
                    starttime=self.starttime,
                    endtime=self.endtime)


@app.route('/api/bridges/<date>')
def bridges(date):
    rows = Structure.query.filter_by(date=date).all()
    return jsonify([r.to_json() for r in rows])


@app.route('/api/kmz/<date>')
def kmz(date):
    rows = Structure.query.filter_by(date=date).all()
    ret = []
    kml = simplekml.Kml()
    kml.document.name = "Bridge locations"

    for row in rows:
        ret.append(row.to_json())
    for bridge in ret:
        xcord = bridge['xcord']
        ycord = bridge['ycord']
        roadname = bridge['roadname']
        stream = bridge['stream']
        fedid = bridge['fedid']
        roadelev = bridge['roadelev']
        MaxWL = bridge['maxwl']
        floodedby = bridge['floodedby']

        if MaxWL == -999.0:
            MaxWL = 0.0

        npo = kml.newpoint(name=roadname, coords=[(xcord, ycord)])
        npo.description = \
            "<![CDATA[<table>" \
            "<tr><td>Stream Crossed: </td><td>" + stream + "</td></tr>" \
            "<tr><td>Bridge Elevation (m): </td><td>" + str(roadelev) + "</td></tr>" \
            "<tr><td><b>Forecasted Overtopping Results from Model</b></td></tr>" \
            "<tr><td>Maximum Water Level (m):</td><td>" + str(MaxWL) + "</td></tr>" \
            "<tr><td>Bridge Overtopped by (m):</td><td>" + str(floodedby) + "</td></tr>" \
            "<tr><td>Overtopping Starting Date/Time:</td><td>" + "Coming Soon" + "</td></tr>" \
            "<tr><td>Overtopping Ending Date/Time:</td><td>" + "Coming Soon" + "</td></tr>" \
            "</table>" \
            "<img src='http://34.207.240.31/static/area_graph.png' height='100' width='300'>]]>"
        npo.style.iconstyle.icon.href = \
            'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png'

        if floodedby > 0.3:
            npo.style.iconstyle.color = simplekml.Color.red
        elif 0 < floodedby <= 0.30:
            npo.style.iconstyle.color = simplekml.Color.yellow
        else:
            npo.style.iconstyle.color = simplekml.Color.green
    filename_ = date + ".kml"
    print filename_
    return Response(kml.kml(), mimetype='application/kml', headers={"Content disposition": "attachment; filename=" + filename_, "Content-Type":"application/kml"})


@app.route('/api/dates')
def dates():
    rows = db.session.query(Structure.date).distinct()
    return jsonify({"dates":rows.all()})


if __name__ == "__main__":
    app.run(port=8000)
