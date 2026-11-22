from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.catalog.models import Lesson, Topic


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Quiz(TimestampedModel):
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="quizzes")
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True, related_name="quizzes")
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY, db_index=True)
    timer_seconds = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(7200)])
    is_published = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ("topic__order", "title")
        indexes = [models.Index(fields=("topic", "is_published", "difficulty"), name="assess_quiz_topic_pub_diff_idx")]

    def clean(self):
        super().clean()
        if self.lesson_id and self.topic_id and self.lesson.topic_id != self.topic_id:
            from django.core.exceptions import ValidationError
            raise ValidationError({"lesson": "The selected lesson must belong to the selected topic."})

    def __str__(self):
        return self.title


class Question(TimestampedModel):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    prompt = models.TextField()
    choices = models.JSONField(default=list, help_text="Ordered list of answer choices with stable keys and display text.")
    correct_answer = models.CharField(max_length=100, help_text="Choice key; never expose in pre-attempt student responses.")
    explanation = models.TextField(blank=True)
    points = models.PositiveSmallIntegerField(default=1, validators=[MinValueValidator(1)])
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("quiz", "order", "id")
        indexes = [models.Index(fields=("quiz", "order"), name="assess_question_quiz_order_idx")]

    def __str__(self):
        return f"{self.quiz.title}: Question {self.order + 1}"


class DailyQuestion(models.Model):
    """One item in the stable, date-rotated C++ daily quiz queue."""

    class Answer(models.TextChoices):
        A = "A", "A"
        B = "B", "B"
        C = "C", "C"
        D = "D", "D"

    position = models.PositiveSmallIntegerField(unique=True, db_index=True)
    question_text = models.TextField()
    option_a = models.TextField()
    option_b = models.TextField()
    option_c = models.TextField()
    option_d = models.TextField()
    correct_answer = models.CharField(max_length=1, choices=Answer.choices)

    class Meta:
        ordering = ("position",)
        constraints = [models.CheckConstraint(condition=models.Q(position__gte=1, position__lte=200), name="daily_question_position_1_200")]

    def __str__(self):
        return f"Daily question {self.position}"


class QuizAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="quiz_attempts")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    answers = models.JSONField(default=dict, blank=True)
    score_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    correct_answers = models.PositiveSmallIntegerField(default=0)
    total_questions = models.PositiveSmallIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("-started_at",)
        indexes = [models.Index(fields=("user", "-started_at"), name="assess_attempt_user_date_idx"), models.Index(fields=("quiz", "-started_at"), name="assess_attempt_quiz_date_idx")]

    def __str__(self):
        return f"{self.user.email} — {self.quiz.title} ({self.score_percent}%)"

# Create your models here.
