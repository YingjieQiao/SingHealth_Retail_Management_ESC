from tests import TestBase
import json, os

"""
S3, database, photo related functions

Testing flow:

4 testing classes

upload photo + related info filled in:
    - success testcase 1: update photo to s3 and entry in mongodb
    - success testcase 2: update photo to s3 and entry in mongodb
    - failed testcase 1: missing required entry in payload
    - failed testcase 2: extra entry in payload

download photo + associated data:
    - success testcase 1: correct number of photo and photo-data
    - failed testcase 1: payload incorrect
    - failed testcase 2: wrong HTTP request

rectify photo:
    - success testcase 1: change `rectified` to True
    - failed testcase 1: extra entry in payload
    
get number of photos post rectify:
    - success testcase: the number of photos whose `rectified == False` is correct
    (also remove dummy entries from the database)
"""

class TestPhoto(TestBase):
    """
    Test uploading to S3 and mongo DB
    """
    TEST_PHOTO_INFO_UPLOAD_PASS_1 = {
        "tags": "tag1",
        "date": "01-01-2222",
        "time": "00:00:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "KFC",
        "rectified": False
    }

    TEST_PHOTO_UPLOAD_PASS_1 = {
        "date": "01-01-2222",
        "time": "00:00:00"
    }

    TEST_PHOTO_INFO_UPLOAD_PASS_2 = {
        "tags": "tag2",
        "date": "01-02-2222",
        "time": "00:02:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "711",
        "rectified": False
    }

    TEST_PHOTO_UPLOAD_PASS_2 = {
        "date": "01-02-2222",
        "time": "00:02:00"
    }

    TEST_PHOTO_INFO_UPLOAD_FAIL_1 = {

    }

    TEST_PHOTO_INFO_UPLOAD_FAIL_2 = {
        "tags": "tag2",
        "date": "01-02-2020",
        "time": "00:02:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "711",
        "rectified": False,
        "a column that does not exist": False,
        "breakit": ""
    }

    TEST_PHOTO_INFO_UPLOAD_PASS_1_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_PASS_1)
    TEST_PHOTO_INFO_UPLOAD_PASS_2_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_PASS_2)
    TEST_PHOTO_INFO_UPLOAD_FAIL_1_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_FAIL_1)
    TEST_PHOTO_INFO_UPLOAD_FAIL_2_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_FAIL_2)

    def test_db_and_s3_upload_pass_1(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True

        rv2 = self.client.post('/upload_file', data=self.TEST_PHOTO_UPLOAD_PASS_1,
                              content_type='multipart/form-data')

        assert rv2.status_code == 200
        assert rv2.json['result'] == True


    def test_db_and_s3_upload_pass_2(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_PASS_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True

        rv2 = self.client.post('/upload_file', data=self.TEST_PHOTO_UPLOAD_PASS_2,
                               content_type='multipart/form-data')

        assert rv2.status_code == 200
        assert rv2.json['result'] == True


    def test_db_and_s3_upload_fail_1(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_FAIL_1_JSON,
                              content_type='multipart/form-data')
        assert rv.status_code == 500
        assert rv.json['result'] == False


    def test_db_and_s3_upload_fail_2(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_FAIL_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False


class TestPreRectifyS3(TestBase):
    """
    Test the functionality of downloading file from S3 and
    retriving data from mongo DB BEFORE rectifying any photos

    """

    TEST_PHOTO_DOWNLOAD_PASS_1 = {
        "counterPart": False
    }

    TEST_PHOTO_DOWNLOAD_FAIL_1 = {
        # empty payload
    }

    TEST_PHOTO_DOWNLOAD_PASS_1_JSON = json.dumps(TEST_PHOTO_DOWNLOAD_PASS_1)
    TEST_PHOTO_DOWNLOAD_FAIL_1_JSON = json.dumps(TEST_PHOTO_DOWNLOAD_FAIL_1)

    def test_s3_download_pass_1(self):
        rv = self.client.post('/download_file', data=self.TEST_PHOTO_DOWNLOAD_PASS_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['photoData']) == list
        assert len(rv.json['photoData']) == 2
        assert type(rv.json['photoAttrData']) == list
        assert len(rv.json['photoAttrData']) == 2


    def test_s3_download_fail_1(self):
        rv = self.client.post('/download_file', data=self.TEST_PHOTO_DOWNLOAD_FAIL_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['photoData'] == None
        assert rv.json['photoAttrData'] == None


    def test_s3_download_fail_2(self):
        rv = self.client.get('/download_file',
                              content_type='application/json')
        assert rv.status_code == 405


class TestRectify(TestBase):
    """
        Test the functionality of downloading file from S3 and
        retriving data from mongo DB AFTER rectifying any photos

        """
    TEST_PHOTO_RECTIFY_1 = {
        "tags": "tag2",
        "date": "01-01-2222",
        "time": "00:00:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "711",
        "rectified": False
    }

    TEST_PHOTO_RECTIFY_2 = {
        "tags": "tag2",
        "date": "01-02-2222",
        "time": "00:02:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "711",
        "rectified": False,
        "breakit": "this col does not exist"
    }

    TEST_PHOTO_RECTIFY_1_JSON = json.dumps(TEST_PHOTO_RECTIFY_1)
    TEST_PHOTO_RECTIFY_2_JSON = json.dumps(TEST_PHOTO_RECTIFY_2)

    def test_photo_rectify_1(self):
        rv = self.client.post('/rectify_photo', data=self.TEST_PHOTO_RECTIFY_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_photo_rectify_2(self):
        rv = self.client.post('/rectify_photo', data=self.TEST_PHOTO_RECTIFY_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False


class TestPostRectifyView(TestBase):
    """
    Verify rectify works and clean up testing entries in DB
    """
    TEST_FILES = ["UnitTester_01-01-2222_00:00:00.jpg", "UnitTester_01-02-2222_00:02:00.jpg"]
    TEST_PHOTO_RECTIFY_PASS_1 = {
        "counterPart": False
    }

    TEST_PHOTO_RECTIFY_PASS_1_JSON = json.dumps(TEST_PHOTO_RECTIFY_PASS_1)

    def test_post_rectify_1(self):

        rv = self.client.post('/download_file', data = self.TEST_PHOTO_RECTIFY_PASS_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert len(rv.json['photoData']) == 1
        assert len(rv.json['photoAttrData']) == 1

        # remove unit test entries in database for cleaning
        TestBase.clean_db_post_test(self)
        TestBase.clean_s3_post_test(self, self.TEST_FILES)
        #TODO delete off entries in notif table too
