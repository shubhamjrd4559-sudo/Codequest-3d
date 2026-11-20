from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Topic(TimestampedModel):
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    summary = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=80, blank=True)
    icon = models.CharField(max_length=80, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ("order", "title")
        indexes = [models.Index(fields=("is_published", "order"), name="catalog_topic_pub_order_idx")]

    def __str__(self):
        return self.title


class Lesson(TimestampedModel):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180)
    introduction = models.TextField(blank=True)
    explanation = models.TextField()
    real_life_example = models.TextField(blank=True)
    cpp_code = models.TextField(blank=True)
    visualization_config = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)
    estimated_minutes = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(240)])
    is_published = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ("topic__order", "order", "title")
        constraints = [models.UniqueConstraint(fields=("topic", "slug"), name="catalog_unique_lesson_slug_per_topic")]
        indexes = [models.Index(fields=("topic", "is_published", "order"), name="cat_lesson_top_pub_ord_idx")]

    def __str__(self):
        return f"{self.topic.title}: {self.title}"


class Game(TimestampedModel):
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=160)
    description = models.TextField()
    learning_objective = models.CharField(max_length=300)
    topics = models.ManyToManyField(Topic, related_name="games", blank=True)
    instructions = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("title",)

    def __str__(self):
        return self.title


class GameLevel(TimestampedModel):
    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="levels")
    level_number = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    title = models.CharField(max_length=160)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.EASY, db_index=True)
    configuration = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ("game", "level_number")
        constraints = [models.UniqueConstraint(fields=("game", "level_number"), name="catalog_unique_game_level_number")]
        indexes = [models.Index(fields=("game", "is_active", "level_number"), name="cat_lvl_game_act_num_idx")]

    def __str__(self):
        return f"{self.game.title} — Level {self.level_number}: {self.title}"


youtube_id_validator = RegexValidator(
    regex=r"^[A-Za-z0-9_-]{11}$",
    message="Enter the 11-character identifier of a real YouTube video.",
)


class VideoLecture(TimestampedModel):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="lectures")
    lesson = models.ForeignKey(Lesson, on_delete=models.SET_NULL, null=True, blank=True, related_name="lectures")
    title = models.CharField(max_length=200)
    youtube_video_id = models.CharField(max_length=11, validators=[youtube_id_validator])
    description = models.TextField(blank=True)
    related_notes = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False, db_index=True)

    class Meta:
        ordering = ("topic__order", "order", "title")
        indexes = [models.Index(fields=("topic", "is_published", "order"), name="catalog_lecture_topic_pub_idx")]

    def clean(self):
        super().clean()
        if self.lesson_id and self.topic_id and self.lesson.topic_id != self.topic_id:
            from django.core.exceptions import ValidationError
            raise ValidationError({"lesson": "The selected lesson must belong to the selected topic."})

    def __str__(self):
        return self.title

# Create your models here.
