from app.config import Config
from app import create_app
from app.models import Photo, User, PhotoNotification, PhotoNotificationFromTenant,  Audit_non_FB,  Audit_FB, Covid_Compliance
import boto3
from botocore.exceptions import ClientError
import os, json


class TestConfig(Config):
    TESTING = True


class TestBase:
    def setup_class(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self._app_context = self.app.app_context()
        self._app_context.push()

    # remove dummy entries in database and S3 to keep them clean,
    # only containing "real" files
    def clean_db_post_test(self):
        testPhotos = Photo.objects(staffName="UnitTester")
        testPhotos.delete()


    def clean_s3_post_test(self, testFiles):
        s3 = boto3.client('s3',
              aws_access_key_id=os.environ.get('ACCESS_KEY'),
              aws_secret_access_key=os.environ.get('SECRET_KEY'))

        for testFile in testFiles:
            s3.delete_object(Bucket='escapp-bucket-dev', Key=testFile)


    def clean_user_post_test(self):
        testUsers = User.objects(lastName="TEST")
        testUsers.delete()
        realUsers = User.objects()
        res = json.loads(realUsers.to_json())
        return len(res) == 5

    def clean_user_post_testv2(self):
        for i in range(1,5):
            testUsers = User.objects(lastName="TEST" + str(i))
            if len(testUsers)!=0:
                testUsers.delete()
                realUsers = User.objects()
                res = json.loads(realUsers.to_json())
        return 

    def clean_audit_test(self):
        testUsers = Audit_FB.objects(comment="TEST")
        testUsers.delete()
        testUsers = Audit_non_FB.objects(comment="TEST")
        testUsers.delete()
        testUsers = Covid_Compliance.objects(comment="TEST")
        testUsers.delete()
        return 


    def clean_db_notif_test(self):
        testPhotoNotifications = PhotoNotification.objects(staffName="UnitTester")
        testPhotoNotifications.delete()

    def clean_db_notif_tenant_test(self):
        testPhotoNotificationFromTenant = PhotoNotificationFromTenant.objects(staffName="UnitTester")
        testPhotoNotificationFromTenant.delete()
