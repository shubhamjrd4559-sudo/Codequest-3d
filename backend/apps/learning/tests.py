from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import StudentProfile, User
from apps.catalog.models import Game, GameLevel, Lesson, Topic
from apps.learning.models import GameAttempt, UserProgress


class StudentProgressApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="student@example.com", password="StrongPassword!2026")
        StudentProfile.objects.create(user=self.user, display_name="Student")
        self.topic = Topic.objects.create(title="Stacks", slug="stacks", summary="Stack basics", is_published=True)
        self.lesson = Lesson.objects.create(topic=self.topic, title="Push and pop", slug="push-pop", explanation="Stack operations", is_published=True)
        self.game = Game.objects.create(slug="stack-tower", title="Stack Tower", description="Stack blocks", learning_objective="LIFO")
        self.level = GameLevel.objects.create(game=self.game, level_number=1, title="First stack")

    def test_progress_game_attempt_and_dashboard_are_protected(self):
        for path, method, data in (
            (f"/api/v1/lessons/{self.lesson.id}/complete/", "post", {}),
            ("/api/v1/game-attempts/", "post", {"game": self.game.id, "score": 2}),
            ("/api/v1/dashboard/summary/", "get", None),
        ):
            response = getattr(self.client, method)(path, data, format="json") if data is not None else self.client.get(path)
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, path)

    def test_lesson_completion_and_game_attempt_are_owned_by_authenticated_student(self):
        self.client.force_authenticate(self.user)
        completion = self.client.post(f"/api/v1/lessons/{self.lesson.id}/complete/", {}, format="json")
        attempt = self.client.post(
            "/api/v1/game-attempts/",
            {"game": self.game.id, "level": self.level.id, "score": 2, "max_score": 3},
            format="json",
        )

        self.assertEqual(completion.status_code, status.HTTP_201_CREATED)
        self.assertEqual(attempt.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserProgress.objects.get().user, self.user)
        self.assertEqual(GameAttempt.objects.get().user, self.user)

    def test_student_cannot_submit_level_for_another_game(self):
        self.client.force_authenticate(self.user)
        other_game = Game.objects.create(slug="other-game", title="Other", description="Other", learning_objective="Other")
        response = self.client.post(
            "/api/v1/game-attempts/",
            {"game": other_game.id, "level": self.level.id, "score": 0},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_role_cannot_access_student_dashboard(self):
        admin = User.objects.create_user(
            email="admin@example.com",
            password="StrongPassword!2026",
            role=User.Role.ADMIN,
        )
        self.client.force_authenticate(admin)

        response = self.client.get("/api/v1/dashboard/summary/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
