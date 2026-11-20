from rest_framework import serializers

from apps.achievements.models import Achievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ("id", "slug", "name", "description", "icon", "xp_reward", "criteria")
