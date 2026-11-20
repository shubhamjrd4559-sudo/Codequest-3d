from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.assessments.models import Question, Quiz, QuizAttempt


class QuizSerializer(serializers.ModelSerializer):
    question_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Quiz
        fields = ("id", "topic", "lesson", "title", "description", "difficulty", "timer_seconds", "question_count")


class PublicQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("id", "quiz", "prompt", "choices", "points", "order")


class QuizAttemptInputSerializer(serializers.Serializer):
    quiz = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.filter(is_published=True, topic__is_published=True))
    answers = serializers.DictField(child=serializers.CharField(allow_blank=True), allow_empty=True)
    duration_seconds = serializers.IntegerField(min_value=0, required=False, default=0)

    def validate_answers(self, answers):
        if any(not str(key).isdigit() for key in answers):
            raise serializers.ValidationError("Answer keys must be question IDs.")
        return answers

    def validate(self, attrs):
        quiz = attrs["quiz"]
        question_ids = set(quiz.questions.values_list("id", flat=True))
        unknown = [str(question_id) for question_id in attrs["answers"] if int(question_id) not in question_ids]
        if unknown:
            raise serializers.ValidationError({"answers": f"Questions do not belong to this quiz: {', '.join(unknown)}"})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        quiz = validated_data["quiz"]
        answers = validated_data["answers"]
        questions = list(quiz.questions.all())
        total_points = sum(question.points for question in questions)
        earned_points = sum(
            question.points
            for question in questions
            if answers.get(str(question.id)) == question.correct_answer
        )
        correct_count = sum(
            1 for question in questions if answers.get(str(question.id)) == question.correct_answer
        )
        score = (Decimal(earned_points) * Decimal("100") / Decimal(total_points)).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        ) if total_points else Decimal("0.00")
        attempt = QuizAttempt.objects.create(
            user=self.context["request"].user,
            quiz=quiz,
            answers=answers,
            score_percent=score,
            correct_answers=correct_count,
            total_questions=len(questions),
            completed_at=timezone.now(),
            duration_seconds=validated_data["duration_seconds"],
        )
        feedback = [
            {
                "question_id": question.id,
                "is_correct": answers.get(str(question.id)) == question.correct_answer,
                "correct_answer": question.correct_answer,
                "explanation": question.explanation,
            }
            for question in questions
        ]
        return attempt, feedback


class QuizAttemptResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ("id", "quiz", "score_percent", "correct_answers", "total_questions", "started_at", "completed_at", "duration_seconds")
