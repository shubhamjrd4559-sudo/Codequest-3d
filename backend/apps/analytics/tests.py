from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import StudentProfile, User


class DashboardPermissionTests(APITestCase):
    def test_dashboard_summary_requires_student_authentication(self):
        response = self.client.get("/api/v1/dashboard/summary/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LeaderboardApiTests(APITestCase):
    def test_leaderboard_returns_top_twenty_students_in_xp_order(self):
        users = []
        for index in range(22):
            user = User.objects.create_user(email=f"hero{index:02}@example.com", password="StrongPassword!2026")
            users.append(user)
            StudentProfile.objects.create(user=user, display_name=f"Hero {index:02}", total_xp=index * 10, level=1 + index // 10)

        response = self.client.get("/api/v1/leaderboard/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 20)
        self.assertEqual(response.data[0]["display_name"], "Hero 21")
        self.assertEqual(response.data[0]["total_xp"], 210)
        self.assertEqual(response.data[-1]["total_xp"], 20)
        self.assertEqual(set(response.data[0]), {"display_name", "total_xp", "level", "avatar_url"})

    def test_dashboard_summary_exposes_gamification_keys(self):
        user = User.objects.create_user(email="dashboard@example.com", password="StrongPassword!2026")
        StudentProfile.objects.create(user=user, display_name="Hero", total_xp=300, level=3, current_streak=4)
        self.client.force_authenticate(user)

        response = self.client.get("/api/v1/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total_xp"], 300)
        self.assertEqual(response.data["current_level"], 3)
        self.assertEqual(response.data["streak"], 4)
        self.assertIn("recent_achievements", response.data)


class UserHeatmapApiTests(APITestCase):
    def test_heatmap_requires_authentication(self):
        response = self.client.get("/api/v1/user/heatmap/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_heatmap_returns_365_days_and_counts_activity(self):
        from datetime import date
        from unittest.mock import patch
        from apps.assessments.models import DailyQuestion, DailyQuizAttempt

        user = User.objects.create_user(email="heatmap@example.com", password="StrongPassword!2026")
        StudentProfile.objects.create(user=user, display_name="Heatmap Hero", total_xp=100)
        self.client.force_authenticate(user)

        with patch("apps.analytics.views.timezone.localdate", return_value=date(2026, 11, 23)):
            # 1. Check with no activity
            response = self.client.get("/api/v1/user/heatmap/")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 365)
            self.assertEqual(response.data[-1]["date"], "2026-11-23")
            self.assertEqual(response.data[-1]["count"], 0)
            self.assertEqual(response.data[0]["date"], "2025-11-24")

            # 2. Complete a daily quiz attempt on 2026-11-23
            question = DailyQuestion.objects.create(
                position=1,
                question_text="Sample question",
                option_a="A",
                option_b="B",
                option_c="C",
                option_d="D",
                correct_answer="A",
            )
            DailyQuizAttempt.objects.create(
                user=user,
                date=date(2026, 11, 23),
                question=question,
                answer="A",
                is_correct=True,
                xp_awarded=50,
            )

            # Re-fetch heatmap
            response = self.client.get("/api/v1/user/heatmap/")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data[-1]["date"], "2026-11-23")
            self.assertEqual(response.data[-1]["count"], 1)

