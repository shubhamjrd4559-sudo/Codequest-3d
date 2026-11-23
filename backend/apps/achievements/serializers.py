from rest_framework import serializers

from apps.achievements.models import Achievement, UserAchievement


class AchievementSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()
    unlocked_at = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ("id", "slug", "name", "description", "icon", "xp_reward", "criteria", "is_unlocked", "unlocked_at")

    def get_is_unlocked(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return False
        user_awards = getattr(self, "_user_awards", None)
        if user_awards is None:
            user_awards = set(UserAchievement.objects.filter(user=request.user).values_list("achievement_id", flat=True))
            self._user_awards = user_awards
        return obj.id in user_awards

    def get_unlocked_at(self, obj):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            return None
        user_dates = getattr(self, "_user_dates", None)
        if user_dates is None:
            user_dates = dict(UserAchievement.objects.filter(user=request.user).values_list("achievement_id", "earned_at"))
            self._user_dates = user_dates
        earned = user_dates.get(obj.id)
        return earned.isoformat() if earned else None

