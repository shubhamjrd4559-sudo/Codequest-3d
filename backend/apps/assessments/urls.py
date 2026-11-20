from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.assessments.views import QuestionViewSet, QuizAttemptSubmitView, QuizViewSet

router = DefaultRouter()
router.register("quizzes", QuizViewSet, basename="quiz")
router.register("questions", QuestionViewSet, basename="question")

urlpatterns = [
    path("quiz-attempts/", QuizAttemptSubmitView.as_view(), name="quiz-attempt-submit"),
] + router.urls
