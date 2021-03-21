from tests import TestBase
import json

class TestUser(TestBase):
    TEST_PHOTO_ACCESS = {
        "filename": "YingjieQiao_03-04-2021_23:41:41.jpg"

    }

    TEST_PHOTO_ACCESS_JSON = json.dumps(TEST_PHOTO_ACCESS)

    def test_db_get(self):
        rv = self.client.post('/get_photo_info', data=self.TEST_PHOTO_ACCESS_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        print(rv.data)
        assert type(rv.json['result'][0]) == dict
        assert rv.json['result'][0]["staffName"] == "YingjieQiao"
        assert rv.json['result'][0]["date"] == "03-04-2021"
        assert rv.json['result'][0]["time"] == "23:41:41"
