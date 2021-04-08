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


class TenantPhoto(db.Document):
    tags = db.StringField(required=True, unique=False)
    date = db.StringField(required=True, unique=False)
    time = db.StringField(required=True, unique=False)
    notes = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    tenantName = db.StringField(required=True, unique=False)
    rectified = db.BooleanField(required=True, unique=False)


class PhotoNotification(db.Document):
    tags = db.StringField(required=True, unique=False)
    date = db.StringField(required=True, unique=False)
    time = db.StringField(required=True, unique=False)
    notes = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    tenantName = db.StringField(required=True, unique=False)
    rectified = db.BooleanField(required=True, unique=False)
    read = db.BooleanField(required=True, unique=False)
    deleted = db.BooleanField(required=True, unique=False) # tenant delete a notification from the panel


class PhotoNotificationFromTenant(db.Document):
    tags = db.StringField(required=True, unique=False)
    date = db.StringField(required=True, unique=False)
    time = db.StringField(required=True, unique=False)
    notes = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    tenantName = db.StringField(required=True, unique=False)
    rectified = db.BooleanField(required=True, unique=False)
    read = db.BooleanField(required=True, unique=False)
    deleted = db.BooleanField(required=True, unique=False) # staff delete a notification from the panel


class Audit_FB(db.Document):
    date = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    staffDepartment = db.StringField(required=True, unique=False)
    totalScore = db.FloatField(required=True, unique=False)
    profScore = db.FloatField(required=True, unique=False)
    profListScore = db.ListField(required=True, unique=False)
    housekeepingScore = db.FloatField(required=True, unique=False)
    houskeepingListScore = db.ListField(required=True, unique=False)
    foodHygieneScore = db.FloatField(required=True, unique=False)
    foodHygieneListScore = db.ListField(required=True, unique=False)
    healthierChoiceScore = db.FloatField(required=True, unique=False)
    healthierChoiceListScore = db.ListField(required=True, unique=False)
    workSafetyScore = db.FloatField(required=True, unique=False)
    workSafetyListScore = db.ListField(required=True, unique=False)
    comments = db.StringField(required=False, unique=False)

    def computeTotalScore(self):
        self.profScore = sum(self.profListScore)
        self.housekeepingScore = sum(self.houskeepingListScore)
        self.foodHygieneScore = sum(self.foodHygieneListScore)
        self.healthierChoiceScore = sum(self.healthierChoiceListScore)
        self.workSafetyScore = sum(self.workSafetyListScore)
        self.totalScore = 0.1*self.profScore + 0.2*self.housekeepingScore + 0.35*self.foodHygieneScore + 0.15*self.healthierChoiceScore + 0.2*self.workSafetyScore


class Audit_non_FB(db.Document):
    timestamp = db.StringField(required=True, unique=False)
    auditorName = db.StringField(required=True, unique=False)
    auditorDepartment = db.StringField(required=True, unique=False)
    auditeeName = db.StringField(required=True, unique=False)
    totalScore = db.FloatField(required=True, unique=False)
    profScore = db.FloatField(required=True, unique=False)
    profListScore = db.ListField(required=False, unique=False)
    housekeepingScore = db.FloatField(required=True, unique=False)
    houskeepingListScore = db.ListField(required=False, unique=False)
    workSafetyScore = db.FloatField(required=True, unique=False)
    workSafetyListScore = db.ListField(required=False, unique=False)
    comment = db.StringField(required=False, unique=False)

    def computeTotalScore(self):
        # self.profScore = sum(self.profListScore)
        # self.housekeepingScore = sum(self.houskeepingListScore)
        # self.workSafetyScore = sum(self.workSafetyListScore)
        self.totalScore = self.profScore + self.housekeepingScore + self.workSafetyScore


class Covid_Compliance(db.Document):
    date = db.StringField(required=True, unique=False)
    staffName = db.StringField(required=True, unique=False)
    staffDepartment = db.StringField(required=True, unique=False)
    comments = db.StringField(required=False, unique=False)
    safetyFrontend = db.ListField(required=True, unique=False)
    safetyBackend = db.ListField(required=True, unique=False)
