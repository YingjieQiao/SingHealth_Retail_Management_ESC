from tests import TestBase
import json


"""
Test endpoints for the notification panel

add new notif:
    - success test case 1: correct input
    - success test case 2: correct input
    - failed test case 1: extra columns
    - failed test case 2: missing columns
    

"""

TEST_PHOTO_NOTIF_PASS_1 = {
    "tags": "tag1",
    "date": "01-01-2222",
    "time": "00:00:00",
    "notes": "UNIT TEST ENTRY",
    "staffName": "UnitTesterStaff",
    "tenantName": "UnitTesterTenant",
    "rectified": False,
    "read": False,
    "deleted": False
}

TEST_PHOTO_NOTIF_PASS_2 = {
    "tags": "tag2",
    "date": "01-02-2222",
    "time": "00:02:00",
    "notes": "UNIT TEST ENTRY",
    "staffName": "UnitTesterStaff",
    "tenantName": "UnitTesterTenant",
    "rectified": False,
    "read": False,
    "deleted": False
}

TEST_PHOTO_NOTIF_FAIL_1 = {
    "tags": "tag2",
    "date": "01-02-2222",
    "time": "00:02:00",
    "notes": "UNIT TEST ENTRY",
    "staffName": "UnitTester",
    "tenantName": "UnitTeste",
    "rectified": False,
    "read": False,
    "deleted": False,
    "extra col": "will break it"
}

TEST_PHOTO_NOTIF_FAIL_2 = {
    # empty
}

TEST_PHOTO_NOTIF_PASS_1_JSON = json.dumps(TEST_PHOTO_NOTIF_PASS_1)
TEST_PHOTO_NOTIF_PASS_2_JSON = json.dumps(TEST_PHOTO_NOTIF_PASS_2)
TEST_PHOTO_NOTIF_FAIL_1_JSON = json.dumps(TEST_PHOTO_NOTIF_FAIL_1)
TEST_PHOTO_NOTIF_FAIL_2_JSON = json.dumps(TEST_PHOTO_NOTIF_FAIL_2)


class TestAddNotif(TestBase):

    def test_add_notif_pass_1(self):
        rv = self.client.post('/test_add_notif', data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_add_notif_pass_2(self):
        rv = self.client.post('/test_add_notif', data=TEST_PHOTO_NOTIF_PASS_2_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_add_notif_fail_1(self):
        rv = self.client.post('/test_add_notif', data=TEST_PHOTO_NOTIF_FAIL_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 500
        assert rv.json['result'] == False


    def test_add_notif_fail_2(self):
        rv = self.client.post('/test_add_notif', data=TEST_PHOTO_NOTIF_FAIL_2_JSON,
                              content_type='application/json')

        assert rv.status_code == 500
        assert rv.json['result'] == False


class TestReadNotif(TestBase):

    # test payload inherited
    def test_read(self):
        rv = self.client.post('/tenant_read_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_get(self):
        rv = self.client.get('/tenant_get_photo_notification',
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['tenantData']) == list
        assert len(rv.json['tenantData']) == 2


class TestDeleteNotif(TestBase):

    def test_delete(self):
        rv = self.client.post('/tenant_delete_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True

        rv2 = self.client.post('/tenant_delete_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_2_JSON,
                              content_type='application/json')

        assert rv2.status_code == 200
        assert rv2.json['result'] == True

    def test_get(self):
        rv = self.client.get('/tenant_get_photo_notification',
                             content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['tenantData']) == list
        assert len(rv.json['tenantData']) == 0


class TestAddNotifStaff(TestBase):

    def test_add_notif_pass_1(self):
        rv = self.client.post('/test_add_notif2', data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_add_notif_pass_2(self):
        rv = self.client.post('/test_add_notif2', data=TEST_PHOTO_NOTIF_PASS_2_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_add_notif_fail_1(self):
        rv = self.client.post('/test_add_notif2', data=TEST_PHOTO_NOTIF_FAIL_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 500
        assert rv.json['result'] == False


    def test_add_notif_fail_2(self):
        rv = self.client.post('/test_add_notif2', data=TEST_PHOTO_NOTIF_FAIL_2_JSON,
                              content_type='application/json')

        assert rv.status_code == 500
        assert rv.json['result'] == False


class TestReadNotifStaff(TestBase):

    # test payload inherited
    def test_read(self):
        rv = self.client.post('/staff_read_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_get(self):
        rv = self.client.get('/staff_get_photo_notification',
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['staffData']) == list
        assert len(rv.json['staffData']) == 2


class TestDeleteNotifStaff(TestBase):

    def test_delete(self):
        rv = self.client.post('/staff_delete_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_1_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True

        rv2 = self.client.post('/staff_delete_photo_notification',
                              data=TEST_PHOTO_NOTIF_PASS_2_JSON,
                              content_type='application/json')

        assert rv2.status_code == 200
        assert rv2.json['result'] == True

    def test_get(self):
        rv = self.client.get('/staff_get_photo_notification',
                             content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['staffData']) == list
        assert len(rv.json['staffData']) == 0


class TestTemp(TestBase):


    def test_get(self):
        rv = self.client.get('/tenant_get_photo_notification',
                             content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['tenantData']) == list
        assert len(rv.json['tenantData']) == 2
