from datetime import date
from unittest.mock import patch

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import StudentProfile, User
from apps.achievements.models import Achievement, UserAchievement
from apps.assessments.models import DailyQuestion, Question, Quiz
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

    def test_quizzes_can_be_filtered_by_each_progressive_level(self):
        stages = ("Foundation", "Core Logic", "Pattern Builder", "Grandmaster")
        quizzes = [
            Quiz.objects.create(
                topic=self.topic,
                title=f"Loops — {stage}",
                is_published=True,
            )
            for stage in stages
        ]

        for level_number, (stage, quiz) in enumerate(zip(stages, quizzes), start=1):
            with self.subTest(level=level_number):
                response = self.client.get(
                    "/api/v1/quizzes/",
                    {"topic": self.topic.slug, "level": level_number},
                )
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(response.data["count"], 1)
                self.assertEqual(response.data["results"][0]["id"], quiz.id)
                self.assertTrue(response.data["results"][0]["title"].endswith(stage))

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


class DailyQuizApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="daily@example.com", password="StrongPassword!2026")
        self.profile = StudentProfile.objects.create(user=self.user, display_name="Daily Learner")
        self.question = DailyQuestion.objects.create(
            position=1,
            question_text="Which type stores a whole number?",
            option_a="int",
            option_b="bool",
            option_c="char",
            option_d="void",
            correct_answer="A",
        )
        self.client.force_authenticate(self.user)

    def test_daily_question_uses_day_of_year_rotation_and_hides_answer(self):
        with patch(
            "apps.assessments.views.timezone.localdate", return_value=date(2026, 1, 1)
        ):
            response = self.client.get("/api/v1/quizzes/daily/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["position"], 1)
        self.assertEqual(response.data["options"]["A"], "int")
        self.assertFalse(response.data["is_daily_quiz_completed"])
        self.assertNotIn("correct_answer", response.data)

    def test_daily_question_is_public_but_never_exposes_the_answer(self):
        from rest_framework.test import APIClient

        anonymous_client = APIClient()
        with patch(
            "apps.assessments.views.timezone.localdate", return_value=date(2026, 1, 1)
        ):
            response = anonymous_client.get("/api/v1/quizzes/daily/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["question_text"], self.question.question_text)
        self.assertFalse(response.data["is_daily_quiz_completed"])
        self.assertNotIn("correct_answer", response.data)

    def test_daily_question_rotation_repeats_after_200_days(self):
        with patch(
            "apps.assessments.views.timezone.localdate", return_value=date(2026, 7, 20)
        ):
            response = self.client.get("/api/v1/quizzes/daily/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["position"], 1)

    def test_correct_daily_answer_awards_50_xp_and_completes_once(self):
        with patch(
            "apps.assessments.views.timezone.localdate", return_value=date(2026, 1, 1)
        ):
            response = self.client.post(
                "/api/v1/quizzes/daily/submit/",
                {"question_id": self.question.pk, "answer": "A"},
                format="json",
            )
            duplicate = self.client.post(
                "/api/v1/quizzes/daily/submit/",
                {"question_id": self.question.pk, "answer": "A"},
                format="json",
            )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["xp_awarded"], 50)
        self.assertEqual(response.data["total_xp"], 50)
        self.assertEqual(duplicate.status_code, status.HTTP_409_CONFLICT)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.total_xp, 50)
        self.assertEqual(self.profile.daily_quiz_completed_on, date(2026, 1, 1))

    def test_wrong_daily_answer_completes_without_xp(self):
        with patch(
            "apps.assessments.views.timezone.localdate", return_value=date(2026, 1, 1)
        ):
            response = self.client.post(
                "/api/v1/quizzes/daily/submit/",
                {"question_id": self.question.pk, "answer": "B"},
                format="json",
            )
            review = self.client.get("/api/v1/quizzes/daily/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_correct"])
        self.assertEqual(response.data["xp_awarded"], 0)
        self.assertEqual(review.data["selected_answer"], "B")
        self.assertEqual(review.data["correct_answer"], "A")
        self.assertFalse(review.data["is_correct"])
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.daily_quiz_completed_on, date(2026, 1, 1))

    def test_daily_completion_flag_is_exposed_in_dashboard_summary(self):
        self.profile.daily_quiz_completed_on = timezone.localdate()
        self.profile.save(update_fields=("daily_quiz_completed_on", "updated_at"))
        response = self.client.get("/api/v1/dashboard/summary/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_daily_quiz_completed"])
