from collections import defaultdict
from datetime import timedelta

from django.db.models import Count
from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import StudentProfile, User
from apps.assessments.models import DailyQuizAttempt, QuizAttempt
from apps.learning.models import GameAttempt, UserProgress


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


class UserHeatmapView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        today = timezone.localdate()
        start_date = today - timedelta(days=364)

        counts_by_date = defaultdict(int)

        # 1. Daily quiz attempts
        daily_attempt_dates = set(
            DailyQuizAttempt.objects.filter(
                user=user, date__gte=start_date, date__lte=today
            ).values_list("date", flat=True)
        )
        for d in daily_attempt_dates:
            counts_by_date[d] += 1

        # Fallback for profile.daily_quiz_completed_on if not recorded in DailyQuizAttempt
        profile = getattr(user, "student_profile", None)
        if profile and profile.daily_quiz_completed_on:
            if start_date <= profile.daily_quiz_completed_on <= today:
                if profile.daily_quiz_completed_on not in daily_attempt_dates:
                    counts_by_date[profile.daily_quiz_completed_on] += 1

        # 2. Topic Quiz attempts
        quiz_counts = (
            QuizAttempt.objects.filter(
                user=user,
                started_at__date__gte=start_date,
                started_at__date__lte=today,
            )
            .values("started_at__date")
            .annotate(cnt=Count("id"))
        )
        for row in quiz_counts:
            counts_by_date[row["started_at__date"]] += row["cnt"]

        # 3. Game attempts
        game_counts = (
            GameAttempt.objects.filter(
                user=user,
                created_at__date__gte=start_date,
                created_at__date__lte=today,
            )
            .values("created_at__date")
            .annotate(cnt=Count("id"))
        )
        for row in game_counts:
            counts_by_date[row["created_at__date"]] += row["cnt"]

        # 4. Completed lessons
        lesson_counts = (
            UserProgress.objects.filter(
                user=user,
                completed_at__date__gte=start_date,
                completed_at__date__lte=today,
            )
            .values("completed_at__date")
            .annotate(cnt=Count("id"))
        )
        for row in lesson_counts:
            counts_by_date[row["completed_at__date"]] += row["cnt"]

        # Build exactly 365 days list from start_date to today
        heatmap_data = []
        curr = start_date
        while curr <= today:
            heatmap_data.append({
                "date": curr.isoformat(),
                "count": counts_by_date.get(curr, 0),
            })
            curr += timedelta(days=1)

        return Response(heatmap_data)

