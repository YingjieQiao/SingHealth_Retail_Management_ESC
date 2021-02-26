from tests import TestBase
import json

class TestUser(TestBase):
    TEST_ACCOUNT = {
        'firstName': 'John',
        'lastName': 'Doe',
        'email': 'test@example.com',
        'password': 'testpassword',
        "mobile": 123,
        "location": "SUTD"
    }

    TEST_ACCOUNT_JSON = json.dumps(TEST_ACCOUNT)
    #TODO more comprehensive test cases

    def test_signup(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert 'id' in rv.json
        assert rv.json['firstName'] == self.TEST_ACCOUNT['firstName']
        assert rv.json['lastName'] == self.TEST_ACCOUNT['lastName']
        assert rv.json['email'] == self.TEST_ACCOUNT['email']
        assert rv.json['mobile'] == self.TEST_ACCOUNT['mobile']
        assert rv.json['location'] == self.TEST_ACCOUNT['location']

    def test_login(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
