from tests import TestBase
import json

"""

2 testing classes:

get db data:
    - success testcase 1: User data
    - success testcase 2: Photo data
    - failed testcase 1: wrong HTTP handle
    - failed testcase 2: payload missing required entry
    
download csv:
    - success testcase 1: User data
    - success testcase 2: Photo data
    - failed testcase 1: wrong HTTP handle
"""

class TestUser(TestBase):
    DB_PAYLOAD_1 = {
        'tableName': 'User'
    }

    DB_PAYLOAD_2 = {
        'tableName': 'Photo'
    }

    DB_PAYLOAD_3 = {

    }

    DB_PAYLOAD_1_JSON = json.dumps(DB_PAYLOAD_1)
    DB_PAYLOAD_2_JSON = json.dumps(DB_PAYLOAD_2)
    DB_PAYLOAD_3_JSON = json.dumps(DB_PAYLOAD_3)


    def test_get_data_pass_1(self):
        rv = self.client.post('/display_data', data=self.DB_PAYLOAD_1_JSON,
                              content_type='application/json')
                              
        assert rv.status_code == 200
        assert rv.json['info'] == 'success'
        assert type(rv.json['data']) == list


    def test_get_data_pass_2(self):
        rv = self.client.post('/display_data', data=self.DB_PAYLOAD_2_JSON,
                              content_type='application/json')

        assert rv.status_code == 200
        assert rv.json['info'] == 'success'
        assert type(rv.json['data']) == list


    def test_get_data_fail_1(self):
        rv = self.client.get('/display_data', content_type='application/json')
        assert rv.status_code == 405


    def test_get_data_fail_2(self):
        rv = self.client.post('/display_data', data=self.DB_PAYLOAD_3_JSON,
                              content_type='application/json')

        assert rv.status_code == 500
        assert rv.json['info'] == 'failed'
        assert rv.json['data'] == None


    def test_write_csv_pass_1(self):
        rv = self.client.post('/download_data_csv', data=self.DB_PAYLOAD_1_JSON,
                        content_type='application/json')
        assert rv.status_code == 200


    def test_write_csv_pass_2(self):
        rv = self.client.post('/download_data_csv', data=self.DB_PAYLOAD_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200


    def test_write_csv_fail_1(self):
        rv = self.client.get('/download_data_csv',
                              content_type='application/json')
        assert rv.status_code == 405


    def test_write_csv_fail_2(self):
        rv = self.client.post('/download_data_csv', data=self.DB_PAYLOAD_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
