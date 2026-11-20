from rest_framework.routers import DefaultRouter

from apps.catalog.views import GameLevelViewSet, GameViewSet, LessonViewSet, TopicViewSet, VideoLectureViewSet

router = DefaultRouter()
router.register("topics", TopicViewSet, basename="topic")
router.register("lessons", LessonViewSet, basename="lesson")
router.register("games", GameViewSet, basename="game")
router.register("game-levels", GameLevelViewSet, basename="game-level")
router.register("video-lectures", VideoLectureViewSet, basename="video-lecture")

urlpatterns = router.urls
