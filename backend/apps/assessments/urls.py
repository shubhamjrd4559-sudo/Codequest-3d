from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.assessments.views import DailyQuestionView, DailyQuizSubmitView, QuestionViewSet, QuizAttemptSubmitView, QuizViewSet

router = DefaultRouter()
router.register("quizzes", QuizViewSet, basename="quiz")
router.register("questions", QuestionViewSet, basename="question")

urlpatterns = [
    path("quizzes/daily/", DailyQuestionView.as_view(), name="daily-quiz"),
    path("quizzes/daily/submit/", DailyQuizSubmitView.as_view(), name="daily-quiz-submit"),
    path("quiz-attempts/", QuizAttemptSubmitView.as_view(), name="quiz-attempt-submit"),
] + router.urls
