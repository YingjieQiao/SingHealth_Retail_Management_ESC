from tests import TestBase
import json

class TestUser(TestBase):
    TEST_ACCOUNT = {
        'username': 'Test Account',
        'email': 'test@example.com',
        'password': 'testpassword'
    }

    TEST_ACCOUNT_JSON = json.dumps(TEST_ACCOUNT)
    #TODO more comprehensive test cases

    def test_signup(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert 'id' in rv.json
        assert rv.json['username'] \
               == self.TEST_ACCOUNT['username']
        assert rv.json['email'] == self.TEST_ACCOUNT['email']

    def test_login(self):
        rv = self.client.post('/login', data=self.TEST_ACCOUNT_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
