from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.achievements.models import Achievement
from apps.achievements.serializers import AchievementSerializer


class AchievementViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = AchievementSerializer
    queryset = Achievement.objects.filter(is_active=True)
