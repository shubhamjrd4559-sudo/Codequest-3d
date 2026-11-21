from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import StudentProfile, User


class LeaderboardView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        profiles = (
            StudentProfile.objects.filter(user__role=User.Role.STUDENT, user__is_active=True)
            .select_related("user")
            .order_by("-total_xp", "user_id")[:20]
        )
        return Response([
            {
                "display_name": profile.display_name or profile.user.first_name or "Learner",
                "total_xp": profile.total_xp,
                "level": profile.current_level,
                "avatar_url": profile.avatar_url or None,
            }
            for profile in profiles
        ])
