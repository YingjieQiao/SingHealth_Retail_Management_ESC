from tests import TestBase

"""

1 testing class:

get db data:
    - failed testcase 1: tenant with no audit data
    - success testcase 1: tenant with audit data
"""


class TestAudit(TestBase):

    TEST_ACCOUNT_1 = {  # to create temp account
        'firstName': "test_1",
        'lastName': 'TEST',
        'email': "test_1@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True
    }

    TEST_ACCOUNT_2 = {  # to create temp account
        'firstName': "test_2",
        'lastName': 'TEST',
        'email': "test_2@test.com",
        'password': "asd123BNM",
        "mobile": 1234,
        "location": "SUTD",
        "staff": False,
        "tenant": True,
        "admin": False,
        "fnb": True
    }

    TEST_AUDIT = {  # login failed testcase 1
        "auditorName" : "Jerry",
        "auditorDepartment" : "Risk",
        "auditeeName" : "test_2@test.com",
        "workSafetyHealthScore" : 10,
        "profStaffHydScore": 6,
        "houseGeneralScore": 7
    }

    TEST_GRAPH_CSV_CALL_1 = {  # failed testcase
        "tenant" : "test_1@test.com"
    }

    TEST_GRAPH_CSV_CALL_2 = {  # passed testcase
        "tenant" : "test_2@test.com"
    }


    def test_audit_submit_pass_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_1_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/tenant_exists', data=self.TEST_GRAPH_CSV_CALL_1,
                              content_type='application/json')
        assert rv.status_code == 500
        assert rv.json['status'] == False
        assert rv.json['info'] == "Not enough data entries"

    def test_audit_submit_fail_1(self):
        rv = self.client.post('/signup', data=self.TEST_ACCOUNT_2_JSON,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/auditChecklist', data=self.TEST_AUDIT,
                              content_type='application/json')
        assert rv.status_code == 200
        rv = self.client.post('/tenant_exists', data=self.TEST_GRAPH_CSV_CALL_1,
                              content_type='application/json')
        assert rv.status_code == 200
        assert rv.json['status'] == True
