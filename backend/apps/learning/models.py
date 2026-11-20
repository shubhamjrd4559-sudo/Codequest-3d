from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.catalog.models import Game, GameLevel, Lesson


class UserProgress(models.Model):
    class Status(models.TextChoices):
        NOT_STARTED = "not_started", "Not started"
        IN_PROGRESS = "in_progress", "In progress"
        COMPLETED = "completed", "Completed"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="user_progress")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NOT_STARTED, db_index=True)
    progress_percent = models.PositiveSmallIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    started_at = models.DateTimeField(null=True, blank=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-last_accessed_at",)
        constraints = [models.UniqueConstraint(fields=("user", "lesson"), name="learning_unique_user_lesson_progress")]
        indexes = [models.Index(fields=("user", "status"), name="learn_prog_user_status_idx"), models.Index(fields=("lesson", "status"), name="learn_prog_lesson_status_idx")]

    def __str__(self):
        return f"{self.user.email} — {self.lesson.title}: {self.status}"


class GameAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="game_attempts")
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="attempts")
    level = models.ForeignKey(GameLevel, on_delete=models.SET_NULL, null=True, blank=True, related_name="attempts")
    score = models.PositiveIntegerField(default=0)
    max_score = models.PositiveIntegerField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    duration_seconds = models.PositiveIntegerField(default=0)
    result_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("user", "-created_at"), name="learning_game_user_date_idx"), models.Index(fields=("game", "-created_at"), name="learning_game_game_date_idx")]

    def __str__(self):
        return f"{self.user.email} — {self.game.title}: {self.score}"

# Create your models here.
