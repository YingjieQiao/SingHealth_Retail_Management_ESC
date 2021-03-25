from app.config import Config
from app import create_app
from app.models import Photo
import boto3
from botocore.exceptions import ClientError
import os


class TestConfig(Config):
    TESTING = True


class TestBase:
    def setup_class(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self._app_context = self.app.app_context()
        self._app_context.push()


    def clean_db_post_test(self):
        testPhotos = Photo.objects(staffName="UnitTester")
        testPhotos.delete()


    def clean_s3_post_test(self, testFiles):
        s3 = boto3.client('s3',
              aws_access_key_id=os.environ.get('ACCESS_KEY'),
              aws_secret_access_key=os.environ.get('SECRET_KEY'))

        for testFile in testFiles:
            s3.delete_object(Bucket='escapp-bucket-dev', Key=testFile)
