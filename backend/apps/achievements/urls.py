from rest_framework.routers import DefaultRouter

from apps.achievements.views import AchievementViewSet

router = DefaultRouter()
router.register("achievements", AchievementViewSet, basename="achievement")

urlpatterns = router.urls
