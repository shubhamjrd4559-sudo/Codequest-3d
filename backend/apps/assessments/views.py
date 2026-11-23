from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.accounts.gamification import add_xp, record_activity
from apps.accounts.models import StudentProfile
from apps.accounts.permissions import IsStudentRole
from apps.assessments.models import DailyQuestion, DailyQuizAttempt, Question, Quiz
from apps.assessments.serializers import (
    PublicQuestionSerializer,
    QuizAttemptInputSerializer,
    QuizAttemptResultSerializer,
    QuizSerializer,
)

QUIZ_LEVEL_TITLES = {
    "1": "Foundation",
    "2": "Core Logic",
    "3": "Pattern Builder",
    "4": "Grandmaster",
}


def get_daily_question(today=None):
    today = today or timezone.localdate()
    position = ((today.timetuple().tm_yday - 1) % 200) + 1
    return DailyQuestion.objects.get(position=position)


class DailyQuestionView(APIView):
    # The prompt and choices are public learning content; answers remain private
    # until an authenticated student submits a response.
    permission_classes = (AllowAny,)

    def get(self, request):
        today = timezone.localdate()
        question = get_daily_question(today)
        profile = None
        if request.user.is_authenticated and request.user.role == "student":
            profile = StudentProfile.objects.filter(user=request.user).only(
                "daily_quiz_completed_on", "daily_quiz_answer", "daily_quiz_is_correct", "total_xp", "level"
            ).first()
        return Response({
            "id": question.pk,
            "position": question.position,
            "date": today.isoformat(),
            "question_text": question.question_text,
            "options": {
                "A": question.option_a,
                "B": question.option_b,
                "C": question.option_c,
                "D": question.option_d,
            },
            "is_daily_quiz_completed": bool(profile and profile.daily_quiz_completed_on == today),
            **({
                "selected_answer": profile.daily_quiz_answer,
                "correct_answer": question.correct_answer,
                "is_correct": profile.daily_quiz_is_correct,
                "xp_awarded": 50 if profile.daily_quiz_is_correct else 0,
                "total_xp": profile.total_xp,
                "level": profile.level,
            } if profile and profile.daily_quiz_completed_on == today else {}),
        })


class DailyQuizSubmitView(APIView):
    permission_classes = (IsAuthenticated, IsStudentRole)

    @transaction.atomic
    def post(self, request):
        today = timezone.localdate()
        profile, _ = StudentProfile.objects.get_or_create(user=request.user)
        profile = profile.__class__.objects.select_for_update().get(pk=profile.pk)
        if profile.daily_quiz_completed_on == today:
            return Response({"detail": "Today's daily quiz has already been completed."}, status=status.HTTP_409_CONFLICT)

        try:
            question_id = int(request.data.get("question_id"))
        except (TypeError, ValueError):
            return Response({"question_id": "A valid question ID is required."}, status=status.HTTP_400_BAD_REQUEST)
        answer = str(request.data.get("answer", "")).strip().upper()
        if answer not in DailyQuestion.Answer.values:
            return Response({"answer": "Choose A, B, C, or D."}, status=status.HTTP_400_BAD_REQUEST)

        question = get_daily_question(today)
        if question.pk != question_id:
            return Response({"question_id": "This is not today's question."}, status=status.HTTP_400_BAD_REQUEST)

        is_correct = answer == question.correct_answer
        xp_awarded = 50 if is_correct else 0
        if is_correct:
            add_xp(request.user, xp_awarded)
        record_activity(request.user, today)
        DailyQuizAttempt.objects.update_or_create(
            user=request.user,
            date=today,
            defaults={
                "question": question,
                "answer": answer,
                "is_correct": is_correct,
                "xp_awarded": xp_awarded,
            },
        )
        profile.daily_quiz_completed_on = today
        profile.daily_quiz_answer = answer
        profile.daily_quiz_is_correct = is_correct
        profile.save(update_fields=("daily_quiz_completed_on", "daily_quiz_answer", "daily_quiz_is_correct", "updated_at"))
        profile.refresh_from_db(fields=("total_xp", "level"))
        return Response({
            "is_correct": is_correct,
            "correct_answer": question.correct_answer,
            "xp_awarded": xp_awarded,
            "total_xp": profile.total_xp,
            "level": profile.level,
            "is_completed": True,
            "date": today.isoformat(),
        }, status=status.HTTP_200_OK)


class QuizViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = QuizSerializer
    queryset = Quiz.objects.filter(is_published=True, topic__is_published=True).annotate(
        question_count=Count("questions")
    ).order_by("topic__order", "title")

    def get_queryset(self):
        queryset = super().get_queryset()
        topic = self.request.query_params.get("topic")
        if topic:
            field = "topic_id" if topic.isdigit() else "topic__slug"
            queryset = queryset.filter(**{field: topic})
        level = self.request.query_params.get("level")
        if level:
            level_title = QUIZ_LEVEL_TITLES.get(level.strip().lower(), level.strip())
            if level_title not in QUIZ_LEVEL_TITLES.values():
                return queryset.none()
            queryset = queryset.filter(title__iendswith=level_title)
        return queryset


class QuestionViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = PublicQuestionSerializer
    queryset = Question.objects.filter(quiz__is_published=True, quiz__topic__is_published=True).select_related("quiz")

    def get_queryset(self):
        queryset = super().get_queryset()
        quiz = self.request.query_params.get("quiz")
        if quiz and quiz.isdigit():
            queryset = queryset.filter(quiz_id=quiz)
        return queryset


class QuizAttemptSubmitView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = QuizAttemptInputSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        attempt, feedback = serializer.save()
        return Response(
            {"attempt": QuizAttemptResultSerializer(attempt).data, "feedback": feedback},
            status=status.HTTP_201_CREATED,
        )
