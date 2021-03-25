from tests import TestBase
import json

class TestUser(TestBase):
    PAYLOAD = {
        'tableName': 'User'
    }
    PAYLOAD_JSON = json.dumps(PAYLOAD)


    def test_get_data(self):
        rv = self.client.get('/display_data', content_type='application/json')
                              
        assert rv.status_code == 200
        assert type(rv.json['userData']) == list
        print(len(rv.json['userData']))
        print(rv.json['userData'])
        print(rv.json['photoData'])


    def test_write_csv(self):
        rv = self.client.post('/download_data_csv', data=self.PAYLOAD_JSON,
                        content_type='application/json')

        assert rv.status_code == 200
