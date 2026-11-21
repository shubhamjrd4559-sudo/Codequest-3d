from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import StudentProfile, User
from apps.achievements.models import Achievement, UserAchievement
from apps.assessments.models import Question, Quiz
from apps.catalog.models import Topic


class AssessmentApiTests(APITestCase):
    def setUp(self):
        self.topic = Topic.objects.create(title="Loops", slug="loops", summary="Loop basics", is_published=True)
        self.quiz = Quiz.objects.create(topic=self.topic, title="Loop quiz", is_published=True)
        self.question = Question.objects.create(
            quiz=self.quiz,
            prompt="Which keyword repeats a block?",
            choices=[{"key": "for", "text": "for"}, {"key": "if", "text": "if"}],
            correct_answer="for",
            explanation="A for loop repeats a block.",
            order=0,
        )

    def test_question_payload_does_not_expose_answer_or_explanation(self):
        response = self.client.get("/api/v1/questions/", {"quiz": self.quiz.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question = response.data["results"][0]
        self.assertEqual(question["id"], self.question.id)
        self.assertNotIn("correct_answer", question)
        self.assertNotIn("explanation", question)

    def test_quiz_attempt_requires_authentication(self):
        response = self.client.post(
            "/api/v1/quiz-attempts/",
            {"quiz": self.quiz.id, "answers": {str(self.question.id): "for"}},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_quiz_attempt_uses_request_user_and_returns_feedback(self):
        user = User.objects.create_user(email="quizzer@example.com", password="StrongPassword!2026")
        self.client.force_authenticate(user)
        response = self.client.post(
            "/api/v1/quiz-attempts/",
            {"quiz": self.quiz.id, "answers": {str(self.question.id): "for"}},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        attempt = user.quiz_attempts.get()
        self.assertEqual(attempt.correct_answers, 1)
        self.assertEqual(response.data["feedback"][0]["correct_answer"], "for")
        self.assertEqual(StudentProfile.objects.get(user=user).total_xp, 10)

    def test_perfect_quiz_awards_first_steps_and_perfect_score(self):
        user = User.objects.create_user(email="perfect@example.com", password="StrongPassword!2026")
        StudentProfile.objects.create(user=user, display_name="Perfect")
        first_steps = Achievement.objects.create(
            slug="first-steps", name="First Steps", description="Complete one quiz.", xp_reward=25,
            criteria={"event": "quiz", "min_attempts": 1},
        )
        perfect = Achievement.objects.create(
            slug="perfect-score", name="Perfect Score", description="Get 100%.", xp_reward=50,
            criteria={"event": "quiz", "perfect_score": True},
        )
        self.client.force_authenticate(user)
        response = self.client.post(
            "/api/v1/quiz-attempts/",
            {"quiz": self.quiz.id, "answers": {str(self.question.id): "for"}},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user.student_profile.refresh_from_db()
        self.assertEqual(user.student_profile.total_xp, 85)
        self.assertSetEqual(
            set(UserAchievement.objects.filter(user=user).values_list("achievement_id", flat=True)),
            {first_steps.id, perfect.id},
        )
