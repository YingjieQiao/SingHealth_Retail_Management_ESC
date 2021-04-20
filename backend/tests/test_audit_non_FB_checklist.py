import json

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
        'auditorName' : "temp_auditor",
        'auditorDepartment' : "Risk",
        'auditeeName' : "temp_audit@temp.com",
        'totalScore' : 44.91666666666667,
        'profstaffhydScoreList' : [1,3,5,3,5,2],
        'profStaffHydScore' : 12,
        'housekeepScoreList' : [1,2,3,4,5,6,7,8,9,7,6,5],
        'houseGeneralScore' : 16.666666666666668,
        'worksafetyhealthScoreList' : [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2],
        'workSafetyHealthScore' : 16.25,
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
    }

    TEST_AUDIT_2 = {  # Missing data
        'auditorName' : "temp_auditor",
        'auditorDepartment' : "Risk",
        'auditeeName' : "temp_audit@temp.com",
        'totalScore' : 44.91666666666667,
        'profstaffhydScoreList' : [1,3,5,3,5,2],
        'profStaffHydScore' : 12,
        'housekeepScoreList' : [1,2,3,4,5,6,7,8,9,7,6,5],
        'houseGeneralScore'  : 16.666666666666668,
        # work safety health data is missing
        'workSafetyHealthScore' : 16.25,
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
    }

    TEST_AUDIT_3 = {  # Extra data
        'auditorName' : "temp_auditor",
        'auditorDepartment' : "Risk",
        'auditeeName' : "temp_audit@temp.com",
        'totalScore' : 44.91666666666667,
        'profstaffhydScoreList' : [1,3,5,3,5,2],
        'profStaffHydScore' : 12,
        'housekeepScoreList' : [1,2,3,4,5,6,7,8,9,7,6,5],
        'houseGeneralScore'  : 16.666666666666668,
        'worksafetyhealthScoreList' : [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2],
        'workSafetyHealthScore' : 16.25,
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con...",
        "extra": 123
    }

    TEST_AUDIT_4 = {  # Incorrect data type
        'auditorName' : "temp_auditor",
        'auditorDepartment' : "Risk",
        'auditeeName' : "temp_audit@temp.com",
        'totalScore' : 44.91666666666667,
        'profstaffhydScoreList' : [1,3,5,3,5,2],
        'profStaffHydScore' : 12,
        'housekeepScoreList' : [1,2,3,4,5,6,7,8,9,7,6,5],
        'houseGeneralScore' : 16.666666666666668,
        'worksafetyhealthScoreList' : [1,2,3,4,5,6,7,8,9,8,7,6,5,4,3,2],
        'workSafetyHealthScore' : 16.25,
        'comment' : 1726 # should be string
    }

    TEST_AUDIT_1_JSON = json.dumps(TEST_AUDIT_1)
    TEST_AUDIT_2_JSON = json.dumps(TEST_AUDIT_2)
    TEST_AUDIT_3_JSON = json.dumps(TEST_AUDIT_3)
    TEST_AUDIT_4_JSON = json.dumps(TEST_AUDIT_4)


    def test_audit_submit_pass_1(self):
        rv = self.client.post('/auditChecklistNonFB', data=self.TEST_AUDIT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['statusText'] == True

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/auditChecklistNonFB', data=self.TEST_AUDIT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_2(self):
        rv = self.client.post('/auditChecklistNonFB', data=self.TEST_AUDIT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_3(self):
        rv = self.client.post('/auditChecklistNonFB', data=self.TEST_AUDIT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

class TestUserCleanUp(TestBase):
    """
    clean up
    """
    def test_cleanup(self):
        TestBase.clean_audit_test(self)
