from rest_framework import status
from rest_framework.test import APITestCase

from apps.achievements.models import Achievement


class AchievementApiTests(APITestCase):
    def test_active_achievements_are_public_and_inactive_ones_are_hidden(self):
        Achievement.objects.create(slug="first-step", name="First Step", description="Complete a lesson.")
        Achievement.objects.create(slug="retired", name="Retired", description="Inactive.", is_active=False)

        response = self.client.get("/api/v1/achievements/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data["results"]], ["first-step"])
