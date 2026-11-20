from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Achievement(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=120)
    description = models.TextField()
    icon = models.CharField(max_length=80, blank=True)
    xp_reward = models.PositiveIntegerField(default=0)
    criteria = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="earned_achievements")
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="earners")
    earned_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("-earned_at",)
        constraints = [models.UniqueConstraint(fields=("user", "achievement"), name="achievements_unique_user_award")]
        indexes = [models.Index(fields=("user", "-earned_at"), name="achievements_user_earned_idx")]

    def __str__(self):
        return f"{self.user.email} — {self.achievement.name}"

# Create your models here.
