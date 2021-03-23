from tests import TestBase
import json


class TestUser(TestBase):
    TEST_PHOTO_INFO_UPLOAD_PASS1 = {
        "tags": "tag1",
        "date": "01-01-2020",
        "time": "00:00:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "KFC",
        "rectified": False
    }

    TEST_PHOTO_INFO_UPLOAD_PASS2 = {
        "tags": "tag2",
        "date": "01-02-2020",
        "time": "00:02:00",
        "notes": "UNIT TEST ENTRY",
        "staffName": "UnitTester",
        "tenantName": "711",
        "rectified": False
    }

    TEST_PHOTO_INFO_UPLOAD_FAIL1 = {

    }

    TEST_PHOTO_INFO_UPLOAD_FAIL2 = {
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

    TEST_PHOTO_INFO_UPLOAD_PASS1_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_PASS1)
    TEST_PHOTO_INFO_UPLOAD_PASS2_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_PASS2)
    TEST_PHOTO_INFO_UPLOAD_FAIL1_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_FAIL1)
    TEST_PHOTO_INFO_UPLOAD_FAIL2_JSON = json.dumps(TEST_PHOTO_INFO_UPLOAD_FAIL2)

    def test_db_upload_pass1(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_PASS1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_db_upload_pass2(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_PASS2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_db_upload_fail1(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_FAIL1_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False


    def test_db_upload_fail2(self):
        rv = self.client.post('/upload_photo_info', data=self.TEST_PHOTO_INFO_UPLOAD_FAIL2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False