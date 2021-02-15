from flask import current_app
from flask_mongoengine import MongoEngine
from flask_bcrypt import generate_password_hash, check_password_hash

db = MongoEngine()

class User(db.Document):
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, unique=False, min_length=8)

    def hash_password(self):
       self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)


"""

class Movie(db.Document):
    name = db.StringField(required=True, unique=True)
    casts = db.ListField(db.StringField(), required=True)
    genres = db.ListField(db.StringField(), required=True)
"""
