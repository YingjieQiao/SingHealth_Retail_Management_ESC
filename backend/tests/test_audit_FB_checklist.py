from tests import TestBase
import json

"""

1 testing class:

get db data:
    - success testcase 1: Correct data with correct column names
    - failed testcase 1: Missing data
    - failed testcase 2: Extra data
    - failed testcase 3: Incorrect data type
"""


class TestAudit(TestBase):

    TEST_AUDIT_1 = {  #  Correct data with correct column names
        'timestamp' : "2021-03-31 02:54:48.316355"
        'auditorName' : "Jerry"
        'auditorDepartment' : "Risk"
        'auditeeName' : "mihir_chhiber@mymail.sutd.edu.sg"
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
        'checklist' : [1,0,-1,1,0,-1,1,0,-1,1,0,-1,1]

    }

    TEST_AUDIT_2 = {  # Missing data
        'timestamp' : "2021-03-31 02:54:48.316355"
        'auditorName' : "Jerry"
        #department is missing
        'auditeeName' : "mihir_chhiber@mymail.sutd.edu.sg"
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
        'checklist' : [1,0,-1,1,0,-1,1,0,-1,1,0,-1,1]
    }

    TEST_AUDIT_3 = {  # Extra data
        'timestamp' : "2021-03-31 02:54:48.316355"
        'auditorName' : "Jerry"
        'auditorDepartment' : "Risk"
        'auditeeName' : "mihir_chhiber@mymail.sutd.edu.sg"
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
        'checklist' : [1,0,-1,1,0,-1,1,0,-1,1,0,-1,1]
        "extra": 123
    }

    TEST_AUDIT_4 = {  # Incorrect data type
        'timestamp' : "2021-03-31 02:54:48.316355"
        'auditorName' : "Jerry"
        'auditorDepartment' : "Risk"
        'auditeeName' : "mihir_chhiber@mymail.sutd.edu.sg"
        'comment' : 1234 # should be string
        'checklist' : [1,0,-1,1,0,-1,1,0,-1,1,0,-1,1]
    }

    TEST_AUDIT_1_JSON = json.dumps(TEST_AUDIT_1)
    TEST_AUDIT_2_JSON = json.dumps(TEST_AUDIT_2)
    TEST_AUDIT_3_JSON = json.dumps(TEST_AUDIT_3)
    TEST_AUDIT_4_JSON = json.dumps(TEST_AUDIT_4)


    def test_audit_submit_pass_1(self):
        rv = self.client.post('/covidChecklist', data=self.TEST_AUDIT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['statusText'] == True

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/covidChecklist', data=self.TEST_AUDIT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_2(self):
        rv = self.client.post('/covidChecklist', data=self.TEST_AUDIT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_3(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False
