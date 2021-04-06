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
    fnb = db.BooleanField(required=True, unique=False)
    meta = {'strict': False}

    staff = db.BooleanField(required=True, default=False)
    tenant = db.BooleanField(required=True, default=False)
    admin = db.BooleanField(required=True, default=False)

    def hash_password(self):
       self.password = generate_password_hash(self.password).decode('utf8')


    def check_password(self, password):
        return check_password_hash(self.password, password)
    

    def setfnb(self,val):
        self.fnb = val


class Photo(db.Document):
    tags = db.StringField(required=True, unique=False)
    date = db.StringField(required=True, unique=False)
    time = db.StringField(required=True, unique=False)
    notes = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    tenantName = db.StringField(required=True, unique=False)
    rectified = db.BooleanField(required=True, unique=False)


class Audit_FB(db.Document):
    timestamp = db.StringField(required=True, unique=False)
    auditorName = db.StringField(required=True, unique=False)
    auditorDepartment = db.StringField(required=True, unique=False)
    auditeeName = db.StringField(required=True, unique=False)
    totalScore = db.FloatField(required=True, unique=False)
    profScore = db.FloatField(required=True, unique=False)
    profstaffhydScoreList = db.ListField(required=False, unique=False)
    housekeepingScore = db.FloatField(required=True, unique=False)
    housekeepScoreList = db.ListField(required=False, unique=False)
    foodHygieneScore = db.FloatField(required=True, unique=False)
    foodhydScoreList = db.ListField(required=False, unique=False)
    healthierScore = db.FloatField(required=True, unique=False)
    healthierScoreList = db.ListField(required=False, unique=False)
    workSafetyScore = db.FloatField(required=True, unique=False)
    worksafetyhealthScoreList = db.ListField(required=False, unique=False)
    comment = db.StringField(required=False, unique=False)

    def computeTotalScore(self):
        self.totalScore = self.profScore + self.housekeepingScore + self.foodHygieneScore + self.healthierScore + self.workSafetyScore


class Audit_non_FB(db.Document):
    timestamp = db.StringField(required=True, unique=False)
    auditorName = db.StringField(required=True, unique=False)
    auditorDepartment = db.StringField(required=True, unique=False)
    auditeeName = db.StringField(required=True, unique=False)
    totalScore = db.FloatField(required=True, unique=False)
    profScore = db.FloatField(required=True, unique=False)
    profstaffhydScoreList = db.ListField(required=False, unique=False)
    housekeepingScore = db.FloatField(required=True, unique=False)
    housekeepScoreList = db.ListField(required=False, unique=False)
    workSafetyScore = db.FloatField(required=True, unique=False)
    worksafetyhealthScoreList = db.ListField(required=False, unique=False)
    comment = db.StringField(required=False, unique=False)

    def computeTotalScore(self):
        # self.profScore = sum(self.profListScore)
        # self.housekeepingScore = sum(self.houskeepingListScore)
        # self.workSafetyScore = sum(self.workSafetyListScore)
        self.totalScore = self.profScore + self.housekeepingScore + self.workSafetyScore


class Covid_Compliance(db.Document):
    timestamp = db.StringField(required=True, unique=False)
    auditorName = db.StringField(required=True, unique=False)
    auditorDepartment = db.StringField(required=True, unique=False)
    auditeeName = db.StringField(required=True, unique=False)
    comment = db.StringField(required=False, unique=False)
    checklist = db.ListField(required=True, unique=False)
