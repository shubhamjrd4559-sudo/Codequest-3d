from django.urls import path

from apps.analytics.views import LeaderboardView

app_name = "analytics_api"

urlpatterns = [
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
]
