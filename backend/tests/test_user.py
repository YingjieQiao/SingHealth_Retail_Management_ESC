from tests import TestBase
import json, os

"""
Authentication flow and Account registration test

Testing flow:

login:
    - success testcase 1: update photo to s3 and entry in mongodb
    - success testcase 2: update photo to s3 and entry in mongodb
    - failed testcase 1: user doe not exist
    - failed testcase 2: user doe not exist and missing required columns
    - failed testcase 3: user exists but missing required columns
    - failed testcase 4: user exists but password is incorrect
    - failed testcase 5: password is correct but 2FA failed

download photo + associated data:
    - success testcase 1: correct number of photo and photo-data
    - failed testcase 1: wrong HTTP request handle

rectify photo:
    - success testcase 1: change `rectified` to True
    - failed testcase 1: extra entry in payload

get number of photos post rectify:
    - success testcase: the number of photos whose `rectified == False` is correct
"""


class TestUserLogin(TestBase):
    TEST_ACCOUNT_1 = { # login failed testcase 1
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'test@example.com',
        'password': 'testpassword',
        "mobile": 123,
        "location": "SUTD"
    }

    TEST_ACCOUNT_2 = {  # login failed testcase 2
        'firstName': 'John',
        'lastName': 'Doe',
        'password': 'testpassword',
        "mobile": 123,
        "location": "SUTD"
    }

    TEST_ACCOUNT_3 = {  # login failed testcase 3
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        "location": "SUTD"
    }

    TEST_ACCOUNT_4 = {  # login failed testcase 4
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        'password': 'wrong password',
        "mobile": 123455,
        "location": "SUTD"
    }

    TEST_ACCOUNT_5 = {  # login failed testcase 5
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        'password': os.environ.get('ESC_TEST_PASSWORD'),
        "mobile": 123455,
        "location": "SUTD"
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)
    TEST_ACCOUNT_3_JSON = json.dumps(TEST_ACCOUNT_3)
    TEST_ACCOUNT_4_JSON = json.dumps(TEST_ACCOUNT_4)
    TEST_ACCOUNT_5_JSON = json.dumps(TEST_ACCOUNT_5)


    def test_login_fail_1(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "user does not exist or payload error"


        """assert 'id' in rv.json
        assert rv.json['firstName'] == self.TEST_ACCOUNT_1['firstName']
        assert rv.json['lastName'] == self.TEST_ACCOUNT_1['lastName']
        assert rv.json['email'] == self.TEST_ACCOUNT_1['email']
        assert rv.json['mobile'] == self.TEST_ACCOUNT_1['mobile']
        assert rv.json['location'] == self.TEST_ACCOUNT_1['location']"""


    def test_login_fail_2(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "user does not exist or payload error"


    def test_login_fail_3(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "user does not exist or payload error"


    def test_login_fail_4(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "password error"


    def test_login_fail_5(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_5_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "2FA sent"

        rv2 = self.client.post('/login_verified',  data=json.dumps({'token': 'wrong token'}),
                              content_type='application/json')

        assert rv2.json['info'] == "2FA error"
        assert rv2.json['result'] == False
        assert rv2.status_code == 500


