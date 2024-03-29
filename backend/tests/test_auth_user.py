from tests import TestBase
import json, os, uuid

"""
Authentication flow and Account registration test

Testing flow:

3 testing classes:

login:
    - failed testcase 1: user doe not exist
    - failed testcase 2: user doe not exist and missing required columns
    - failed testcase 3: user exists but missing required columns
    - failed testcase 4: user exists but password is incorrect
    - failed testcase 5: password is correct but 2FA failed, staff account
    - failed testcase 5: password is correct but 2FA failed, tenant account

sign up:
    - success testcase 1: staff account
    - success testcase 2: tenant account
    - failed testcase 1: missing columns
    - failed testcase 2: extra columns
    
clean up:
    - remove dummy entries from the database
"""


class TestUserLogin(TestBase):
    """
    Test login
    """

    TEST_ACCOUNT_1 = { # login failed testcase 1
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'test@example.com',
        'password': 'testpassword',
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_2 = {  # login failed testcase 2
        'firstName': 'John',
        'lastName': 'Doe',
        'password': 'testpassword',
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False
    }

    TEST_ACCOUNT_3 = {  # login failed testcase 3
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False
    }

    TEST_ACCOUNT_4 = {  # login failed testcase 4
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        'password': 'wrong password',
        "mobile": 1234,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_5 = {  # login failed testcase 5
        'firstName': 'Yingjie',
        'lastName': 'Qiao',
        'email': 'yingjie_qiao@mymail.sutd.edu.sg',
        'password': os.environ.get('ESC_TEST_PASSWORD'),
        "mobile": 1234,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_6 = {  # login failed testcase 5
        'firstName': 'Ross',
        'lastName': 'Geller',
        'email': 'yingjie_qiao@outlook.com',
        'password': os.environ.get('ESC_TEST_PASSWORD'),
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)
    TEST_ACCOUNT_3_JSON = json.dumps(TEST_ACCOUNT_3)
    TEST_ACCOUNT_4_JSON = json.dumps(TEST_ACCOUNT_4)
    TEST_ACCOUNT_5_JSON = json.dumps(TEST_ACCOUNT_5)
    TEST_ACCOUNT_6_JSON = json.dumps(TEST_ACCOUNT_6)


    def test_login_fail_1(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False


    def test_login_fail_2(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False


    def test_login_fail_3(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False


    def test_login_fail_4(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False


    def test_login_fail_5(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_5_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['info'] == "2FA sent"
        assert rv.json['result'] == True


        rv2 = self.client.post('/login_verified',  data=json.dumps({'token': 'wrong token'}),
                              content_type='application/json')

        assert rv2.json['info'] == "2FA error"
        assert rv2.json['result'] == False
        assert rv2.status_code == 500

    def test_login_fail_6(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_6_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "2FA sent"

        rv2 = self.client.post('/login_verified', data=json.dumps({'token': 'wrong token'}),
                               content_type='application/json')

        assert rv2.json['info'] == "2FA error"
        assert rv2.json['result'] == False
        assert rv2.status_code == 500


class TestUserSignUp(TestBase):
    """
    Test sign up

    """

    TEST_ACCOUNT_1 = {  # signup success testcase 1
        'firstName': "UNIT", # str(uuid.uuid4())
        'lastName': 'TEST',
        'email': str(uuid.uuid4()) + "@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_2 = {  # signup success testcase 2
        'firstName': "UNIT", # str(uuid.uuid4())
        'lastName': 'TEST',
        'email': str(uuid.uuid4()) + "@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked": False,
        "attempts": 0
    }

    TEST_ACCOUNT_3 = {  # signup failed testcase 3

    }

    TEST_ACCOUNT_4 = {  # signup failed testcase 4
        'firstName': str(uuid.uuid4()),
        'lastName': 'TEST',
        'email': str(uuid.uuid4()) + "@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "extra column": "will break"
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)
    TEST_ACCOUNT_3_JSON = json.dumps(TEST_ACCOUNT_3)
    TEST_ACCOUNT_4_JSON = json.dumps(TEST_ACCOUNT_4)

    def test_signup_pass_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "Registeration Success"


    def test_signup_pass_2(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "Registeration Success"


    def test_signup_fail_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "Registeration Failed"


    def test_signup_fail_2(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['result'] == False
        assert rv.json['info'] == "Registeration Failed"


class TestUserTypeCheck(TestBase):

    def test_check_staff_pass(self):
        rv = self.client.get('/check_if_staff',
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True


    def test_check_tenant_pass(self):
        rv = self.client.get('/check_if_tenant',
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True


class TestUserCleanUp(TestBase):
    """
    clean up
    """
    def test_cleanup(self):
        TestBase.clean_user_post_test(self)
