from django.urls import path

from apps.analytics.views import LeaderboardView, UserHeatmapView

app_name = "analytics_api"

urlpatterns = [
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    path("user/heatmap/", UserHeatmapView.as_view(), name="user-heatmap"),
]

