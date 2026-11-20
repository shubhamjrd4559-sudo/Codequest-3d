from rest_framework import status
from rest_framework.test import APITestCase


class DashboardPermissionTests(APITestCase):
    def test_dashboard_summary_requires_student_authentication(self):
        response = self.client.get("/api/v1/dashboard/summary/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
