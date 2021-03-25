from tests import TestBase
import json


class TestUser(TestBase):
    """UPLOAD_PHOTO_PAYLOAD = {
        'file': ,
        'time': "01:01:01",
        'date': "01-01-2021"
    }"""


    def test_download(self):
        rv = self.client.get('/download_file',
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        assert type(rv.json['photoData']) == list
        print(rv.json['photoData'])
        assert len(rv.json['photoData']) == 1
        assert type(rv.json['photoAttrData']) == list
        print(rv.json['photoAttrData'])
        assert len(rv.json['photoData']) == 1
