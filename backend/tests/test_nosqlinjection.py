from tests import TestBase
import json, os, uuid

"""
Authentication flow and Account registration test

Testing flow:

3 testing classes:

login:
    - failed testcase 1: different types of nosql injection to check if database is safe
    - failed testcase 2: different types of nosql injection to check if database is safe
sign up:
    - success testcase 1: different types of nosql injection to check if database is safe
    - success testcase 2: different types of nosql injection to check if database is safe
"""


class TestUserLogin(TestBase):
    """
    Test login
    """

    TEST_ACCOUNT_1 = { # login failed testcase 1
        'firstName': 'DROP User;--',
        'lastName': "' OR ‘0’='0",
        'email': 'temp1@temp.com" OR 1=1--',
        'password': '10; DROP TABLE members --',
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True
    }

    TEST_ACCOUNT_2 = {  # login failed testcase 2
        'firstName': "' OR ‘0’='0",
        'lastName': 'DROP User;--',
        'email': 'temp2@temp.com" OR 1=1--',
        'password': "\”1' or '1' = '1’ /*\”",
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)


    def test_login_fail_1(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False
        assert rv.json['info'] == "user does not exist or password error"


        """assert 'id' in rv.json
        assert rv.json['firstName'] == self.TEST_ACCOUNT_1['firstName']
        assert rv.json['lastName'] == self.TEST_ACCOUNT_1['lastName']
        assert rv.json['email'] == self.TEST_ACCOUNT_1['email']
        assert rv.json['mobile'] == self.TEST_ACCOUNT_1['mobile']
        assert rv.json['location'] == self.TEST_ACCOUNT_1['location']"""


    def test_login_fail_2(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 401
        assert rv.json['result'] == False
        assert rv.json['info'] == "user does not exist or password error"


class TestUserSignUp(TestBase):
    """
    Test sign up

    signup endpoint payload:
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        mobile: this.state.mobile,
        password: this.state.password,
        location: this.state.location,
        tenant: this.state.tenant,
        staff: this.state.staff,
        admin:this.state.admin
    """
    
    TEST_ACCOUNT_1 = { # login failed testcase 1
        'firstName': 'DROP User;--',
        'lastName': "TEST1",
        'email': 'temp1@temp.com" OR 1=1--',
        'password': '10; DROP TABLE members --',
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "fnb": True,
        "locked" : False,
        "attempts" : 0
    }

    TEST_ACCOUNT_2 = {  # login failed testcase 2
        'firstName': "' OR ‘0’='0",
        'lastName': 'TEST2',
        'email': 'temp2@temp.com" OR 1=1--',
        'password': "\”1' or '1' = '1’ /*\”",
        "mobile": 123,
        "location": "SUTD",
        "staff": True,
        "tenant": False,
        "admin": False,
        "locked" : False,
        "attempts" : 0,
        "fnb" : False
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)

    def test_signup_fail_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "Registeration Success"


    def test_signup_fail_2(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        print(rv.json['info'])
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert rv.json['info'] == "Registeration Success"

class TestUserCleanUp(TestBase):
    """
    clean up
    """
    def test_cleanup(self):
        TestBase.clean_user_post_testv2(self)
