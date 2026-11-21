from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.accounts.models import StudentProfile


# Cumulative XP thresholds: Level 2 starts at 100 XP, Level 3 at 300 XP,
# and Level 4 at 600 XP. Additional levels continue in 300 XP increments.
LEVEL_THRESHOLDS = (100, 300, 600)


def level_for_xp(total_xp):
    level = 1
    remaining_xp = total_xp
    for threshold in LEVEL_THRESHOLDS:
        if total_xp >= threshold:
            level += 1
        else:
            break
    if total_xp >= LEVEL_THRESHOLDS[-1]:
        level += (total_xp - LEVEL_THRESHOLDS[-1]) // 300
    return level


@transaction.atomic
def add_xp(user, amount):
    if amount < 0:
        raise ValueError("XP amount cannot be negative.")
    profile, _ = StudentProfile.objects.get_or_create(user=user)
    profile = StudentProfile.objects.select_for_update().get(pk=profile.pk)
    if amount:
        profile.total_xp += amount
        profile.level = level_for_xp(profile.total_xp)
        profile.save(update_fields=("total_xp", "level", "updated_at"))
    return profile


@transaction.atomic
def record_activity(user, activity_date=None):
    """Update the activity streak once per local calendar day."""
    profile, _ = StudentProfile.objects.get_or_create(user=user)
    profile = StudentProfile.objects.select_for_update().get(pk=profile.pk)
    today = activity_date or timezone.localdate()
    previous_date = profile.last_activity_date

    if previous_date == today:
        return profile
    if previous_date == today - timedelta(days=1):
        profile.current_streak += 1
    else:
        profile.current_streak = 1

    profile.longest_streak = max(profile.longest_streak, profile.current_streak)
    profile.last_activity_date = today
    profile.save(update_fields=("current_streak", "longest_streak", "last_activity_date", "updated_at"))
    return profile
