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
    is_completed = models.BooleanField(default=False, db_index=True)
    xp_awarded = models.BooleanField(default=False)
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


class LearningModule(models.Model):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    description = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True, db_index=True)
    lessons = models.ManyToManyField(
        Lesson,
        through="LearningModuleLesson",
        related_name="learning_modules",
    )

    class Meta:
        ordering = ("order", "title")

    def __str__(self):
        return self.title


class LearningChapter(models.Model):
    module = models.ForeignKey(LearningModule, on_delete=models.CASCADE, related_name="chapters")
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=200)
    description = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("module__order", "order", "title")
        constraints = [models.UniqueConstraint(fields=("module", "slug"), name="learning_unique_chapter_slug")]

    def __str__(self):
        return f"{self.module.title} — {self.title}"


class LearningModuleLesson(models.Model):
    module = models.ForeignKey(LearningModule, on_delete=models.CASCADE, related_name="module_lessons")
    chapter = models.ForeignKey(
        LearningChapter, on_delete=models.SET_NULL, null=True, blank=True, related_name="lesson_memberships"
    )
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="module_memberships")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("module__order", "order", "lesson__title")
        constraints = [models.UniqueConstraint(fields=("module", "lesson"), name="learning_unique_module_lesson")]

    def __str__(self):
        return f"{self.module.title} — {self.lesson.title}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.chapter_id and self.chapter.module_id != self.module_id:
            raise ValidationError({"chapter": "The chapter must belong to this learning module."})


class LessonBookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_bookmarks")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="bookmarks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        constraints = [models.UniqueConstraint(fields=("user", "lesson"), name="learning_unique_user_lesson_bookmark")]

    def __str__(self):
        return f"{self.user} — {self.lesson.title}"


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
