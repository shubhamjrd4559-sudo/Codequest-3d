from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsStudentRole
from apps.achievements.models import UserAchievement
from apps.assessments.models import QuizAttempt
from apps.catalog.models import Lesson
from apps.learning.models import GameAttempt, UserProgress
from apps.learning.serializers import (
    EarnedAchievementSerializer,
    GameAttemptInputSerializer,
    GameAttemptResultSerializer,
    QuizAttemptSummarySerializer,
    UserProgressSerializer,
)


class CompleteLessonView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    @transaction.atomic
    def post(self, request, pk):
        lesson = get_object_or_404(Lesson, pk=pk, is_published=True)
        now = timezone.now()
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            defaults={
                "status": UserProgress.Status.COMPLETED,
                "progress_percent": 100,
                "started_at": now,
                "last_accessed_at": now,
                "completed_at": now,
            },
        )
        if not created:
            progress.status = UserProgress.Status.COMPLETED
            progress.progress_percent = 100
            progress.last_accessed_at = now
            progress.completed_at = progress.completed_at or now
            progress.started_at = progress.started_at or now
            progress.save(update_fields=("status", "progress_percent", "last_accessed_at", "completed_at", "started_at", "updated_at"))
        return Response(UserProgressSerializer(progress).data, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


class GameAttemptCreateView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated, IsStudentRole)
    serializer_class = GameAttemptInputSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt = serializer.save()
        return Response(GameAttemptResultSerializer(attempt).data, status=status.HTTP_201_CREATED)


class DashboardSummaryView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    def get(self, request):
        user = request.user
        progress = UserProgress.objects.filter(user=user)
        profile = getattr(user, "student_profile", None)
        recent_achievements = EarnedAchievementSerializer(
            UserAchievement.objects.filter(user=user, achievement__is_active=True)
            .select_related("achievement")[:10],
            many=True,
        ).data
        return Response(
            {
                "student": {
                    "id": user.id,
                    "email": user.email,
                    "display_name": profile.display_name if profile else "",
                },
                "current_xp": profile.total_xp if profile else 0,
                "total_xp": profile.total_xp if profile else 0,
                "level": profile.level if profile else 1,
                "current_level": profile.current_level if profile else 1,
                "current_streak": profile.current_streak if profile else 0,
                "streak": profile.current_streak if profile else 0,
                "completed_lessons": progress.filter(status=UserProgress.Status.COMPLETED).count(),
                "in_progress_lessons": progress.filter(status=UserProgress.Status.IN_PROGRESS).count(),
                "total_published_lessons": Lesson.objects.filter(is_published=True).count(),
                "recent_game_scores": GameAttemptResultSerializer(
                    GameAttempt.objects.filter(user=user).select_related("game", "level")[:5], many=True
                ).data,
                "recent_quiz_attempts": QuizAttemptSummarySerializer(
                    QuizAttempt.objects.filter(user=user).select_related("quiz")[:5], many=True
                ).data,
                "recent_achievements": recent_achievements,
                "achievements": recent_achievements,
            }
        )
