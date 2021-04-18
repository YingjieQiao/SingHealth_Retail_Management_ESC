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
        'auditorName' : "temp_auditor"
        'auditorDepartment' : "Risk"
        'auditeeName' : "temp_audit@temp.com"
        'totalScore' : 44.91666666666667
        'profstaffhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8]
        'profStaffHydScore' : 12
        'housekeepScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4]
        'housekeepScore' : 16.666666666666668
        'worksafetyhealthScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4,5]
        'workSafetyHealthScore' : 16.25
        'foodHydScore' : 19.2972972972973
        'foodhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,2,3,4,5]
        'healthierScore' : 8.045454545454545
        'healthierScoreList': [1,2,3,4,5,6,7,8,9,8,7]
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
    }

    TEST_AUDIT_2 = {  # Missing data
        'auditorName' : "temp_auditor"
        'auditorDepartment' : "Risk"
        'auditeeName' : "temp_audit@temp.com"
        'totalScore' : 44.91666666666667
        'profstaffhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8]
        'profStaffHydScore' : 12
        'housekeepScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4]
        'housekeepScore' : 16.666666666666668
        'worksafetyhealthScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4,5]
        'workSafetyHealthScore' : 16.25
        'foodHydScore' : 19.2972972972973
        'foodhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,2,3,4,5]
        'healthierScore' : 8.045454545454545
        # healthier score list data is missing
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
    }

    TEST_AUDIT_3 = {  # Extra data
        'auditorName' : "temp_auditor"
        'auditorDepartment' : "Risk"
        'auditeeName' : "temp_audit@temp.com"
        'totalScore' : 44.91666666666667
        'profstaffhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8]
        'profStaffHydScore' : 12
        'housekeepScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4]
        'housekeepScore' : 16.666666666666668
        'worksafetyhealthScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4,5]
        'workSafetyHealthScore' : 16.25
        'foodHydScore' : 19.2972972972973
        'foodhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,2,3,4,5]
        'healthierScore' : 8.045454545454545
        'healthierScoreList': [1,2,3,4,5,6,7,8,9,8,7]
        'comment' : "The hygiene level needs attention otherwise suspension of lease of con..."
        "extra": 123
    }

    TEST_AUDIT_4 = {  # Incorrect data type
        'auditorName' : "temp_auditor"
        'auditorDepartment' : "Risk"
        'auditeeName' : "temp_audit@temp.com"
        'totalScore' : 44.91666666666667
        'profstaffhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8]
        'profStaffHydScore' : 12
        'housekeepScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4]
        'housekeepScore' : 16.666666666666668
        'worksafetyhealthScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,4,5]
        'workSafetyHealthScore' : 16.25
        'foodHydScore' : 19.2972972972973
        'foodhydScoreList' : [1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,3,5,3,5,2,2,3,4,5,6,7,8,1,2,3,1,2,3,4,5]
        'healthierScore' : 8.045454545454545
        'healthierScoreList': [1,2,3,4,5,6,7,8,9,8,7]
        'comment' : 1726 # should be string
    }

    TEST_AUDIT_1_JSON = json.dumps(TEST_AUDIT_1)
    TEST_AUDIT_2_JSON = json.dumps(TEST_AUDIT_2)
    TEST_AUDIT_3_JSON = json.dumps(TEST_AUDIT_3)
    TEST_AUDIT_4_JSON = json.dumps(TEST_AUDIT_4)


    def test_audit_submit_pass_1(self):
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['statusText'] == True

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_2(self):
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False

    def test_audit_submit_fail_3(self):
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['statusText'] == False
