from flask import current_app
from flask_mongoengine import MongoEngine


db = MongoEngine()

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, unique=False)


class Movie(db.Document):
    name = db.StringField(required=True, unique=True)
    casts = db.ListField(db.StringField(), required=True)
    genres = db.ListField(db.StringField(), required=True)
