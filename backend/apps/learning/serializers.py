from rest_framework import serializers

from apps.achievements.models import UserAchievement
from apps.assessments.models import QuizAttempt
from apps.catalog.models import Game, GameLevel, Lesson
from apps.learning.models import GameAttempt, UserProgress


class UserProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)

    class Meta:
        model = UserProgress
        fields = ("id", "lesson", "lesson_title", "status", "progress_percent", "started_at", "last_accessed_at", "completed_at")
        read_only_fields = fields


class GameAttemptInputSerializer(serializers.Serializer):
    game = serializers.PrimaryKeyRelatedField(queryset=Game.objects.filter(is_active=True))
    level = serializers.PrimaryKeyRelatedField(queryset=GameLevel.objects.filter(is_active=True), required=False, allow_null=True)
    score = serializers.IntegerField(min_value=0)
    max_score = serializers.IntegerField(min_value=1, required=False, allow_null=True)
    completed = serializers.BooleanField(default=False)
    duration_seconds = serializers.IntegerField(min_value=0, default=0)
    result_data = serializers.DictField(required=False, default=dict)

    def validate(self, attrs):
        level = attrs.get("level")
        if level and level.game_id != attrs["game"].id:
            raise serializers.ValidationError({"level": "The level must belong to the selected game."})
        maximum = attrs.get("max_score")
        if maximum is not None and attrs["score"] > maximum:
            raise serializers.ValidationError({"score": "Score cannot exceed max_score."})
        return attrs

    def create(self, validated_data):
        return GameAttempt.objects.create(user=self.context["request"].user, **validated_data)


class GameAttemptResultSerializer(serializers.ModelSerializer):
    game_title = serializers.CharField(source="game.title", read_only=True)

    class Meta:
        model = GameAttempt
        fields = ("id", "game", "game_title", "level", "score", "max_score", "completed", "duration_seconds", "result_data", "created_at")


class QuizAttemptSummarySerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)

    class Meta:
        model = QuizAttempt
        fields = ("id", "quiz", "quiz_title", "score_percent", "correct_answers", "total_questions", "completed_at")


class EarnedAchievementSerializer(serializers.ModelSerializer):
    slug = serializers.CharField(source="achievement.slug", read_only=True)
    name = serializers.CharField(source="achievement.name", read_only=True)
    icon = serializers.CharField(source="achievement.icon", read_only=True)
    xp_reward = serializers.IntegerField(source="achievement.xp_reward", read_only=True)

    class Meta:
        model = UserAchievement
        fields = ("id", "slug", "name", "icon", "xp_reward", "earned_at")
