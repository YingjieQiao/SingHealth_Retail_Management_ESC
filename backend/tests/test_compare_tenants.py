from tests import TestBase
import json

"""

1 testing class:

get db data:
    - failed testcase 1: tenant with no audit data
    - success testcase 1: tenant with audit data
"""


class TestAudit(TestBase):
    TEST_ACCOUNT_1 = {  # to create temp account
        'firstName': "test_1",
        'lastName': 'TEST1',
        'email': "test_1@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked" : False,
        "attempts" : 0
    }

    TEST_ACCOUNT_2 = {  # to create temp account
        'firstName': "test_2",
        'lastName': 'TEST2',
        'email': "test_2@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked" : False,
        "attempts" : 0
    }

    TEST_ACCOUNT_3 = {  # to create temp account
        'firstName': "test_3",
        'lastName': 'TEST3',
        'email': "test_3@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked" : False,
        "attempts" : 0
    }

    TEST_ACCOUNT_4 = {  # to create temp account
        'firstName': "test_4",
        'lastName': 'TEST4',
        'email': "test_4@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True,
        "locked" : False,
        "attempts" : 0
    }

    TEST_AUDIT_1 = {  # creating a new data entry
        'auditorName': "temp_auditor",
        'auditorDepartment': "Risk",
        'auditeeName': "test_3@test.com",
        'totalScore': 44.91666666666667,
        'profstaffhydScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8],
        'profStaffHydScore': 12,
        'housekeepScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4],
        'housekeepScore': 16.666666666666668,
        'worksafetyhealthScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5],
        'workSafetyHealthScore': 16.25,
        'foodHydScore': 19.2972972972973,
        'foodhydScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1,
                             2, 3, 1, 2, 3, 4, 5],
        'healthierScore': 8.045454545454545,
        'healthierScoreList': [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7],
        'comment': "TEST"
    }

    TEST_AUDIT_2 = {  # creating a new data entry
        'auditorName': "temp_auditor",
        'auditorDepartment': "Risk",
        'auditeeName': "test_4@test.com",
        'totalScore': 44.91666666666667,
        'profstaffhydScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8],
        'profStaffHydScore': 12,
        'housekeepScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4],
        'housekeepScore': 16.666666666666668,
        'worksafetyhealthScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5],
        'workSafetyHealthScore': 16.25,
        'foodHydScore': 19.2972972972973,
        'foodhydScoreList': [1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 1, 3, 5, 3, 5, 2, 2, 3, 4, 5, 6, 7, 8, 1,
                             2, 3, 1, 2, 3, 4, 5],
        'healthierScore': 8.045454545454545,
        'healthierScoreList': [1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7],
        'comment': "TEST"
    }

    TEST_GRAPH_CSV_CALL_1 = {  # failed testcase
        "institute1": "test_1@test.com",
        "institute2": "test_2@test.com"
    }

    TEST_GRAPH_CSV_CALL_2 = {  # passed testcase
        "institute1": "test_3@test.com",
        "institute2": "test_4@test.com"
    }

    TEST_REPORT_CALL = {
        "institute1" : "test_3@test.com",
        "institute2" : "test_4@test.com",
        "emailContent" : {"email" : "test_1@test.com", "body" : "123", "subject" : "123"}
    }

    TEST_ACCOUNT_1_JSON = json.dumps(TEST_ACCOUNT_1)
    TEST_ACCOUNT_2_JSON = json.dumps(TEST_ACCOUNT_2)
    TEST_ACCOUNT_3_JSON = json.dumps(TEST_ACCOUNT_3)
    TEST_ACCOUNT_4_JSON = json.dumps(TEST_ACCOUNT_4)
    TEST_AUDIT_1_JSON = json.dumps(TEST_AUDIT_1)
    TEST_AUDIT_2_JSON = json.dumps(TEST_AUDIT_2)
    TEST_GRAPH_CSV_CALL_1_JSON = json.dumps(TEST_GRAPH_CSV_CALL_1)
    TEST_GRAPH_CSV_CALL_2_JSON = json.dumps(TEST_GRAPH_CSV_CALL_2)
    TEST_REPORT_CAL_JSON= json.dumps(TEST_REPORT_CALL_JSON)

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/compare_tenant', data=self.TEST_GRAPH_CSV_CALL_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['status'] == False
        assert rv.json['info'] == "Not enough data entries"

    def test_audit_submit_pass_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_3_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_4_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/auditChecklistFB', data=self.TEST_AUDIT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/compare_tenant', data=self.TEST_GRAPH_CSV_CALL_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['result'] == True
        rv = self.client.post('/report_dashboard', data=self.TEST_REPORT_CALL_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['status'] == True


class TestUserCleanUp(TestBase):
    """
    clean up
    """
    def test_cleanup(self):
        TestBase.clean_user_post_testv2(self)
        TestBase.clean_audit_test(self)
