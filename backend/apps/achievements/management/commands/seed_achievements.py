from django.core.management.base import BaseCommand

from apps.achievements.models import Achievement


DEFAULT_ACHIEVEMENTS = (
    {
        "slug": "first-steps",
        "name": "First Steps",
        "description": "Complete your first quiz.",
        "icon": "sparkles",
        "xp_reward": 25,
        "criteria": {"event": "quiz", "min_attempts": 1},
    },
    {
        "slug": "perfect-score",
        "name": "Perfect Score",
        "description": "Earn 100% on a quiz attempt.",
        "icon": "star",
        "xp_reward": 50,
        "criteria": {"event": "quiz", "perfect_score": True},
    },
    {
        "slug": "stack-master",
        "name": "Stack Master",
        "description": "Complete five Stack Tower games.",
        "icon": "layers",
        "xp_reward": 75,
        "criteria": {"event": "game", "game_slug": "stack-tower", "min_completed": 5},
    },
    {
        "slug": "quiz-explorer",
        "name": "Quiz Explorer",
        "description": "Complete five quizzes.",
        "icon": "brain",
        "xp_reward": 50,
        "criteria": {"event": "quiz", "min_attempts": 5},
    },
    {
        "slug": "arcade-adventurer",
        "name": "Arcade Adventurer",
        "description": "Complete ten mini-games.",
        "icon": "gamepad-2",
        "xp_reward": 100,
        "criteria": {"event": "game", "min_completed": 10},
    },
    {
        "slug": "three-day-streak",
        "name": "On a Roll",
        "description": "Keep a learning streak for three days.",
        "icon": "flame",
        "xp_reward": 40,
        "criteria": {"event": "activity", "min_streak": 3},
    },
)


class Command(BaseCommand):
    help = "Create or update the default CodeQuest achievements."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        for item in DEFAULT_ACHIEVEMENTS:
            defaults = {key: value for key, value in item.items() if key != "slug"}
            _, created = Achievement.objects.update_or_create(slug=item["slug"], defaults=defaults)
            created_count += int(created)
            updated_count += int(not created)
        self.stdout.write(self.style.SUCCESS(
            f"Achievements ready: {created_count} created, {updated_count} updated, {len(DEFAULT_ACHIEVEMENTS)} total."
        ))
