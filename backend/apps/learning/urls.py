from django.urls import path

from apps.learning.views import CompleteLessonView, DashboardSummaryView, GameAttemptCreateView

app_name = "learning_api"

urlpatterns = [
    path("lessons/<int:pk>/complete/", CompleteLessonView.as_view(), name="lesson-complete"),
    path("game-attempts/", GameAttemptCreateView.as_view(), name="game-attempt-create"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
]
