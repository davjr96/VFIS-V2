from flask import Flask, jsonify, render_template, Response, request, g, url_for, abort
import constants
import simplekml
from flask_httpauth import HTTPBasicAuth
import json
from models import Alert, User, Constructions, Forecast, db

# Set Up Flask Constants and Login
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgres://" + constants.user + \
    ":" + constants.password + "@" + constants.host + ":5432/postgres"
app.debug = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(email=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@app.route('/api/user', methods=['POST'])
def new_user():
    userData = request.json
    password = request.json.get('password')
    if userData['access'] !=  "UVAHYDRO":
        abort(401)
    del userData['password']
    del userData['access']
    userData['role'] = "user"
    if User.query.filter_by(email=userData['email']).first() is not None:
        abort(400)    # existing user
    user = User(**request.json)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    token = user.generate_auth_token()
    return jsonify({ "status": "OK",'token': token.decode('ascii') }), 201

@app.route('/api/user')
@auth.login_required
def get_user():
    user = User.query.get(g.user.id)
    if not user:
        abort(400)
    return jsonify(user.as_dict())

@app.route('/api/login')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token()
    return jsonify({ "status": "OK",'token': token.decode('ascii') }), 200

@app.route('/api/bridges/<date>')
@auth.login_required
def bridges(date):
    rows = db.session.query(Forecast.start_date, Forecast.end_date,Forecast.maxwl,Forecast.floodedby, Constructions.fedid, Constructions.roadname, Constructions.xcord, Constructions.ycord, Constructions.stream, Constructions.roadelev).join(Constructions, Forecast.construction_fed_id == Constructions.fedid).filter(Forecast.run_date_time == date).all()
    if rows == []:
        rows = Constructions.query.all()
        return json.dumps([row.as_dict() for row in rows])
    return json.dumps([row._asdict() for row in rows])

@app.route('/api/bridges')
@auth.login_required
def get_bridges():
    rows = Constructions.query.all()
    return json.dumps([row.as_dict() for row in rows])


@app.route('/api/dates')
@auth.login_required
def dates():
    rows = Forecast.query.distinct(Forecast.run_date_time)
    rows = [r.run_date_time for r in rows]
    return jsonify({"dates": rows[::-1]})

@app.route('/api/alerts', methods=['POST'])
@auth.login_required
def set_alerts():
    user_id =  g.user.id
    constructions = json.loads(request.data)["constructions"]
    for item in constructions:
        alert = Alert(constructions_fedid = float(item), users_id = user_id)
        db.session.add(alert)
        db.session.commit()
    return Response(status=201)

@app.route('/api/alerts', methods=['DELETE'])
@auth.login_required
def delete_alerts():
    user_id =  g.user.id
    constructions = json.loads(request.data)["constructions"]
    for item in constructions:
        Alert.query.filter_by(constructions_fedid = str(float(item)), users_id = user_id ).delete()
        db.session.commit()
    return Response(status=202)

@app.route('/api/alerts')
@auth.login_required
def get_alerts():
    user_id =  g.user.id
    rows = db.session.query(Constructions.fedid).filter(Alert.users_id == user_id).join(Alert, Alert.constructions_fedid == Constructions.fedid).all()
    return json.dumps([row._asdict() for row in rows])


@app.route('/api/kml/<date>')
def kmz(date):
    rows = db.session.query(Forecast.start_date, Forecast.end_date,Forecast.maxwl,Forecast.floodedby, Constructions.fedid, Constructions.roadname, Constructions.xcord, Constructions.ycord, Constructions.stream, Constructions.roadelev).join(Constructions, Forecast.construction_fed_id == Constructions.fedid).filter(Forecast.run_date_time == date).all()
    ret = []
    for row in rows:
        ret.append(row._asdict())
    if rows == []:
        rows = Constructions.query.all()
        for row in rows:
            ret.append(row.as_dict())

    kml = simplekml.Kml()
    kml.document.name = "Bridge locations"

    for bridge in ret:
        xcord = bridge['xcord']
        ycord = bridge['ycord']
        roadname = bridge['roadname']
        stream = bridge['stream']
        fedid = bridge['fedid']
        roadelev = bridge['roadelev']
        try:
            MaxWL = bridge['maxwl']
            floodedby = bridge['floodedby']
        except:
            MaxWL = 0
            floodedby = 0


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
    return Response(kml.kml(), mimetype='application/kml', headers={"Content-disposition": "attachment; filename=" + filename_, "Content-Type": "application/kml"})


if __name__ == "__main__":
    app.run(port=8000)
