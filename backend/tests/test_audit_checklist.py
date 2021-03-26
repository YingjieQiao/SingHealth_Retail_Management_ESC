from tests import TestBase

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
        "auditorName" : "Jerry",
        "auditorDepartment" : "Risk",
        "auditeeName" : "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore" : 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": 7
    }

    TEST_AUDIT_2 = {  # Missing data
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "houseGeneralScore": 7
    }

    TEST_AUDIT_3 = {  # Extra data
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": 7,
        "test": 123
    }

    TEST_AUDIT_4 = {  # Incorrect data type
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": "this is wrong datatype"
    }

    def test_audit_submit_pass_1(self):
        
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_1,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['statusText'] == True

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_2,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_2(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_3,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_3(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_4,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False
