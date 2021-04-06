from tests import TestBase
<<<<<<< Updated upstream
import json
=======
>>>>>>> Stashed changes

"""

1 testing class:

get db data:
    - success testcase 1: Correct data with correct column names
    - failed testcase 1: Missing data
    - failed testcase 2: Extra data
    - failed testcase 3: Incorrect data type
"""


class TestAudit(TestBase):

<<<<<<< Updated upstream
    TEST_AUDIT_1 = {  #  Correct data with correct column names
=======
    TEST_AUDIT_1 = {  # login failed testcase 1
>>>>>>> Stashed changes
        "auditorName" : "Jerry",
        "auditorDepartment" : "Risk",
        "auditeeName" : "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore" : 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": 7
    }

<<<<<<< Updated upstream
    TEST_AUDIT_2 = {  # Missing data
=======
    TEST_AUDIT_2 = {  # login failed testcase 1
>>>>>>> Stashed changes
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "houseGeneralScore": 7
    }

<<<<<<< Updated upstream
    TEST_AUDIT_3 = {  # Extra data
=======
    TEST_AUDIT_3 = {  # login failed testcase 1
>>>>>>> Stashed changes
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": 7,
        "test": 123
    }

<<<<<<< Updated upstream
    TEST_AUDIT_4 = {  # Incorrect data type
=======
    TEST_AUDIT_4 = {  # login failed testcase 1
>>>>>>> Stashed changes
        "auditorName": "Jerry",
        "auditorDepartment": "Risk",
        "auditeeName": "mihir_chhiber@mymail.sutd.edu.sg",
        "workSafetyHealthScore": 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": "this is wrong datatype"
    }

<<<<<<< Updated upstream
    TEST_AUDIT_1_JSON = json.dumps(TEST_AUDIT_1)
    TEST_AUDIT_2_JSON = json.dumps(TEST_AUDIT_2)
    TEST_AUDIT_3_JSON = json.dumps(TEST_AUDIT_3)
    TEST_AUDIT_4_JSON = json.dumps(TEST_AUDIT_4)


    def test_audit_submit_pass_1(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_1_JSON,
=======
    def test_audit_submit_pass_1(self):
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_1,
>>>>>>> Stashed changes
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['statusText'] == True

    def test_audit_submit_fail_1(self):
<<<<<<< Updated upstream
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_2_JSON,
=======
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_2,
>>>>>>> Stashed changes
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_2(self):
<<<<<<< Updated upstream
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_3_JSON,
=======
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_3,
>>>>>>> Stashed changes
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_3(self):
<<<<<<< Updated upstream
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_4_JSON,
=======
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT_4,
>>>>>>> Stashed changes
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False
