from django.db import transaction
from django.db.models import Prefetch, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsStudentRole
from apps.accounts.gamification import add_xp, record_activity
from apps.achievements.models import UserAchievement
from apps.assessments.models import QuizAttempt
from apps.catalog.models import Lesson
from apps.learning.models import GameAttempt, LearningChapter, LearningModule, LearningModuleLesson, LessonBookmark, UserProgress
from apps.learning.serializers import (
    EarnedAchievementSerializer,
    GameAttemptInputSerializer,
    GameAttemptResultSerializer,
    QuizAttemptSummarySerializer,
    UserProgressSerializer,
)


def get_learning_path_progress(user):
    available_lessons = LearningModuleLesson.objects.filter(
        module__is_published=True,
        lesson__is_published=True,
    )
    total = available_lessons.count()
    completed = UserProgress.objects.filter(
        user=user,
        is_completed=True,
        lesson__module_memberships__module__is_published=True,
        lesson__is_published=True,
    ).values("lesson_id").distinct().count()
    percentage = round((completed / total) * 100) if total else 0
    return completed, total, percentage


class LearningPathView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    def get(self, request):
        memberships = LearningModuleLesson.objects.filter(
            lesson__is_published=True,
            module__is_published=True,
        ).select_related("lesson", "chapter").order_by("order", "lesson__order", "lesson__title")
        modules = LearningModule.objects.filter(is_published=True).prefetch_related(
            Prefetch("module_lessons", queryset=memberships, to_attr="ordered_memberships"),
            Prefetch("chapters", queryset=LearningChapter.objects.filter(is_published=True).order_by("order", "title")),
        )
        progress_by_lesson = {
            row.lesson_id: row
            for row in UserProgress.objects.filter(user=request.user).select_related("lesson")
        }
        module_payload = []
        for module in modules:
            lessons = []
            for membership in module.ordered_memberships:
                lesson = membership.lesson
                progress = progress_by_lesson.get(lesson.id)
                lessons.append({
                    "id": lesson.id,
                    "title": lesson.title,
                    "slug": lesson.slug,
                    "order": membership.order,
                    "estimated_minutes": lesson.estimated_minutes,
                    "is_completed": bool(progress and progress.is_completed),
                    "completed_at": progress.completed_at if progress else None,
                    "has_content": bool(lesson.lesson_content or lesson.introduction or lesson.explanation),
                    "chapter_id": membership.chapter_id,
                })
            if lessons:
                chapter_payload = []
                for chapter in module.chapters.all():
                    chapter_lessons = [item for item in lessons if item["chapter_id"] == chapter.id]
                    if chapter_lessons:
                        chapter_completed = sum(bool(item["is_completed"]) for item in chapter_lessons)
                        chapter_payload.append({
                            "id": chapter.id,
                            "title": chapter.title,
                            "slug": chapter.slug,
                            "description": chapter.description,
                            "order": chapter.order,
                            "lessons": chapter_lessons,
                            "completed_lessons": chapter_completed,
                            "total_lessons": len(chapter_lessons),
                            "progress_percent": round(chapter_completed / len(chapter_lessons) * 100),
                        })
                module_completed = sum(bool(item["is_completed"]) for item in lessons)
                module_payload.append({
                    "id": module.id,
                    "title": module.title,
                    "slug": module.slug,
                    "description": module.description,
                    "order": module.order,
                    "lessons": lessons,
                    "chapters": chapter_payload,
                    "completed_lessons": module_completed,
                    "total_lessons": len(lessons),
                    "progress_percent": round(module_completed / len(lessons) * 100),
                })

        completed, total, percentage = get_learning_path_progress(request.user)
        return Response({
            "modules": module_payload,
            "completed_lessons": completed,
            "total_lessons": total,
            "course_progress": percentage,
        })


class LearningLessonDetailView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    def get(self, request, lesson_id):
        membership = get_object_or_404(
            LearningModuleLesson.objects.select_related("lesson", "module", "chapter"),
            lesson_id=lesson_id,
            lesson__is_published=True,
            module__is_published=True,
        )
        lesson = membership.lesson
        progress = UserProgress.objects.filter(user=request.user, lesson=lesson).first()
        siblings = list(
            LearningModuleLesson.objects.filter(
                module=membership.module,
                lesson__is_published=True,
                module__is_published=True,
            ).select_related("lesson").order_by("order", "lesson__order", "lesson__title")
        )
        position = next(index for index, item in enumerate(siblings) if item.lesson_id == lesson.id)
        previous_lesson = siblings[position - 1].lesson if position > 0 else None
        next_lesson = siblings[position + 1].lesson if position + 1 < len(siblings) else None
        return Response({
            "id": lesson.id,
            "title": lesson.title,
            "slug": lesson.slug,
            "introduction": lesson.introduction,
            "explanation": lesson.explanation,
            "real_life_example": lesson.real_life_example,
            "cpp_code": lesson.cpp_code,
            "lesson_content": lesson.lesson_content,
            "estimated_minutes": lesson.estimated_minutes,
            "is_completed": bool(progress and progress.is_completed),
            "module": {"id": membership.module_id, "title": membership.module.title, "slug": membership.module.slug},
            "chapter": ({"id": membership.chapter_id, "title": membership.chapter.title, "slug": membership.chapter.slug} if membership.chapter_id else None),
            "previous": ({"id": previous_lesson.id, "title": previous_lesson.title} if previous_lesson else None),
            "next": ({"id": next_lesson.id, "title": next_lesson.title} if next_lesson else None),
            "is_bookmarked": LessonBookmark.objects.filter(user=request.user, lesson=lesson).exists(),
        })


class LessonBookmarkToggleView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    def post(self, request, lesson_id):
        lesson = get_object_or_404(
            Lesson.objects.filter(module_memberships__module__is_published=True),
            pk=lesson_id,
            is_published=True,
        )
        bookmark, created = LessonBookmark.objects.get_or_create(user=request.user, lesson=lesson)
        if not created:
            bookmark.delete()
        return Response({"lesson_id": lesson.id, "is_bookmarked": created})


class LearningSearchView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    def get(self, request):
        query = request.query_params.get("q", "").strip()[:100]
        if len(query) < 2:
            return Response({"results": []})
        lessons = Lesson.objects.filter(
            is_published=True,
            module_memberships__module__is_published=True,
        ).filter(
            Q(title__icontains=query)
            | Q(introduction__icontains=query)
            | Q(explanation__icontains=query)
            | Q(lesson_content__detailed_theory__icontains=query)
            | Q(lesson_content__definition__icontains=query)
            | Q(lesson_content__real_world_example__icontains=query)
        ).distinct().order_by("topic__order", "order", "title")[:25]
        return Response({"results": [
            {"id": item.id, "title": item.title, "topic": item.topic.title, "slug": item.slug}
            for item in lessons
        ]})


class ToggleLessonProgressView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    @transaction.atomic
    def post(self, request, lesson_id):
        lesson = get_object_or_404(
            Lesson.objects.filter(learning_modules__is_published=True),
            pk=lesson_id,
            is_published=True,
        )
        now = timezone.now()
        progress, _ = UserProgress.objects.select_for_update().get_or_create(
            user=request.user,
            lesson=lesson,
        )
        progress.is_completed = not progress.is_completed
        progress.status = UserProgress.Status.COMPLETED if progress.is_completed else UserProgress.Status.NOT_STARTED
        progress.progress_percent = 100 if progress.is_completed else 0
        progress.started_at = progress.started_at or now
        progress.last_accessed_at = now
        progress.completed_at = now if progress.is_completed else None
        xp_awarded = 0
        if progress.is_completed and not progress.xp_awarded:
            add_xp(request.user, 10)
            record_activity(request.user)
            progress.xp_awarded = True
            xp_awarded = 10
        progress.save(update_fields=(
            "is_completed", "status", "progress_percent", "started_at", "last_accessed_at",
            "completed_at", "xp_awarded", "updated_at",
        ))
        completed, total, percentage = get_learning_path_progress(request.user)
        profile = getattr(request.user, "student_profile", None)
        return Response({
            **UserProgressSerializer(progress).data,
            "course_progress": percentage,
            "completed_lessons": completed,
            "total_lessons": total,
            "xp_awarded": xp_awarded,
            "total_xp": profile.total_xp if profile else 0,
        })


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
                "is_completed": True,
                "progress_percent": 100,
                "started_at": now,
                "last_accessed_at": now,
                "completed_at": now,
            },
        )
        xp_awarded = False
        if not created:
            if not progress.is_completed and not progress.xp_awarded:
                add_xp(request.user, 10)
                record_activity(request.user)
                progress.xp_awarded = True
                xp_awarded = True
            elif progress.is_completed and not progress.xp_awarded:
                # Existing progress rows may predate the XP flag.
                progress.xp_awarded = True
            progress.is_completed = True
            progress.status = UserProgress.Status.COMPLETED
            progress.progress_percent = 100
            progress.last_accessed_at = now
            progress.completed_at = progress.completed_at or now
            progress.started_at = progress.started_at or now
            progress.save(update_fields=("is_completed", "xp_awarded", "status", "progress_percent", "last_accessed_at", "completed_at", "started_at", "updated_at"))
        else:
            add_xp(request.user, 10)
            record_activity(request.user)
            progress.xp_awarded = True
            progress.save(update_fields=("xp_awarded", "updated_at"))
            xp_awarded = True
        completed, total, percentage = get_learning_path_progress(request.user)
        return Response({
            **UserProgressSerializer(progress).data,
            "course_progress": percentage,
            "completed_lessons": completed,
            "total_lessons": total,
            "xp_awarded": 10 if xp_awarded else 0,
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


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
        completed_lessons, total_lessons, course_progress = get_learning_path_progress(user)
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
                "is_daily_quiz_completed": bool(profile and profile.daily_quiz_completed_on == timezone.localdate()),
                "completed_lessons": completed_lessons,
                "in_progress_lessons": progress.filter(status=UserProgress.Status.IN_PROGRESS).count(),
                "total_published_lessons": total_lessons,
                "course_progress": course_progress,
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
