from django.db.models import Count
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.assessments.models import Question, Quiz
from apps.assessments.serializers import (
    PublicQuestionSerializer,
    QuizAttemptInputSerializer,
    QuizAttemptResultSerializer,
    QuizSerializer,
)


class QuizViewSet(ReadOnlyModelViewSet):
    permission_classes = (AllowAny,)
    serializer_class = QuizSerializer
    queryset = Quiz.objects.filter(is_published=True, topic__is_published=True).annotate(question_count=Count("questions"))

    def get_queryset(self):
        queryset = super().get_queryset()
        topic = self.request.query_params.get("topic")
        if topic:
            field = "topic_id" if topic.isdigit() else "topic__slug"
            queryset = queryset.filter(**{field: topic})
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
