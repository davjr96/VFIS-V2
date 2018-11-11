# The entry point for our flask module

# Imports
from flask import Flask
import constants
from flask_httpauth import HTTPBasicAuth
from .models import Alert, User, Constructions, Forecast, db

# Configuration from file

flaskapp = Flask(__name__)
flaskapp.config['SQLALCHEMY_DATABASE_URI'] = "postgres://" + constants.user + \
    ":" + constants.password + "@" + constants.host + ":5432/postgres"
flaskapp.debug = True
flaskapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(flaskapp)
auth = HTTPBasicAuth()

# import views
from . import views
