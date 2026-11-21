from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.db.models import Q

from apps.catalog.models import Game, GameLevel, Lesson, Topic, VideoLecture
from apps.catalog.serializers import (
    GameLevelSerializer,
    GameSerializer,
    LessonSerializer,
    TopicSerializer,
    VideoLectureSerializer,
)


def apply_topic_filter(queryset, request, relation="topic"):
    topic = request.query_params.get("topic")
    if not topic:
        return queryset
    if topic.isdigit():
        field = f"{relation}__id" if relation.endswith("s") else f"{relation}_id"
    else:
        field = f"{relation}__slug"
    return queryset.filter(**{field: topic})


class PublishedReadOnlyViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)


class TopicViewSet(PublishedReadOnlyViewSet):
    serializer_class = TopicSerializer
    queryset = Topic.objects.filter(is_published=True)
    lookup_field = "slug"


class LessonViewSet(PublishedReadOnlyViewSet):
    serializer_class = LessonSerializer
    queryset = Lesson.objects.filter(is_published=True, topic__is_published=True).select_related("topic")

    def get_queryset(self):
        return apply_topic_filter(super().get_queryset(), self.request)


class GameViewSet(PublishedReadOnlyViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.filter(is_active=True).filter(
        Q(topics__is_published=True) | Q(topics__isnull=True)
    ).distinct().prefetch_related("topics")

    def get_queryset(self):
        return apply_topic_filter(super().get_queryset(), self.request, relation="topics")


class GameLevelViewSet(PublishedReadOnlyViewSet):
    serializer_class = GameLevelSerializer
    queryset = GameLevel.objects.filter(is_active=True, game__is_active=True).select_related("game")

    def get_queryset(self):
        queryset = super().get_queryset()
        game = self.request.query_params.get("game")
        if game:
            field = "game_id" if game.isdigit() else "game__slug"
            queryset = queryset.filter(**{field: game})
        return queryset


class VideoLectureViewSet(PublishedReadOnlyViewSet):
    serializer_class = VideoLectureSerializer
    queryset = VideoLecture.objects.filter(
        is_published=True,
        topic__is_published=True,
    ).filter(Q(lesson__isnull=True) | Q(lesson__is_published=True)).select_related("topic", "lesson")

    def get_queryset(self):
        queryset = apply_topic_filter(super().get_queryset(), self.request)
        lesson = self.request.query_params.get("lesson")
        if lesson and lesson.isdigit():
            queryset = queryset.filter(lesson_id=lesson)
        return queryset
