from rest_framework import serializers

from apps.catalog.models import Game, GameLevel, Lesson, Topic, VideoLecture


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "title", "slug", "summary", "description", "category", "icon", "order")


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            "id",
            "topic",
            "title",
            "slug",
            "introduction",
            "explanation",
            "real_life_example",
            "cpp_code",
            "visualization_config",
            "order",
            "estimated_minutes",
        )


class GameSerializer(serializers.ModelSerializer):
    topics = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ("id", "slug", "title", "description", "learning_objective", "instructions", "topics")


class GameLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameLevel
        fields = ("id", "game", "level_number", "title", "difficulty", "configuration")


class VideoLectureSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoLecture
        fields = (
            "id",
            "topic",
            "lesson",
            "title",
            "youtube_video_id",
            "search_url",
            "description",
            "related_notes",
            "order",
        )
