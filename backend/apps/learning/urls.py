from django.urls import path

from apps.learning.views import (
    CompleteLessonView,
    DashboardSummaryView,
    GameAttemptCreateView,
    LearningPathView,
    LearningLessonDetailView,
    LearningSearchView,
    LessonBookmarkToggleView,
    ToggleLessonProgressView,
)

app_name = "learning_api"

urlpatterns = [
    path("learning/path/", LearningPathView.as_view(), name="learning-path"),
    path("learning/lessons/<int:lesson_id>/", LearningLessonDetailView.as_view(), name="learning-lesson-detail"),
    path("learning/lessons/<int:lesson_id>/bookmark/", LessonBookmarkToggleView.as_view(), name="learning-lesson-bookmark"),
    path("learning/search/", LearningSearchView.as_view(), name="learning-search"),
    path("progress/lesson/<int:lesson_id>/toggle/", ToggleLessonProgressView.as_view(), name="lesson-progress-toggle"),
    path("lessons/<int:pk>/complete/", CompleteLessonView.as_view(), name="lesson-complete"),
    path("game-attempts/", GameAttemptCreateView.as_view(), name="game-attempt-create"),
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
]
