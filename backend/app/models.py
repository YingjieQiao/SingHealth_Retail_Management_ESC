from flask_mongoengine import MongoEngine
from flask_bcrypt import generate_password_hash, check_password_hash

db = MongoEngine()

class User(db.Document):
    firstName = db.StringField(required=True, unique=False)
    lastName = db.StringField(required=True, unique=False)
    email = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, unique=False, min_length=8)
    location = db.StringField(required=True, unique=False)
    mobile = db.IntField(required=True, unique=False)


    def hash_password(self):
       self.password = generate_password_hash(self.password).decode('utf8')

    def check_password(self, password):
        return check_password_hash(self.password, password)
    

