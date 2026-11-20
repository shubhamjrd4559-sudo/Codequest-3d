from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User
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
