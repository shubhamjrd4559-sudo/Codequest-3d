from apps.accounts.gamification import add_xp
from apps.achievements.models import Achievement, UserAchievement


def award_eligible_achievements(user, event, attempt=None):
    """Grant newly earned achievements for the submitted activity."""
    granted = []
    rules = Achievement.objects.filter(is_active=True, criteria__event=event)

    for achievement in rules:
        criteria = achievement.criteria or {}
        eligible = False

        if event == "quiz":
            completed_quizzes = user.quiz_attempts.filter(completed_at__isnull=False).count()
            eligible = completed_quizzes >= criteria.get("min_attempts", 0)
            if criteria.get("perfect_score"):
                eligible = bool(attempt and float(attempt.score_percent) >= 100)
        elif event == "game":
            completed_games = user.game_attempts.filter(completed=True)
            game_slug = criteria.get("game_slug")
            if game_slug:
                completed_games = completed_games.filter(game__slug=game_slug)
            eligible = completed_games.count() >= criteria.get("min_completed", 0)
        elif event == "activity":
            profile = getattr(user, "student_profile", None)
            eligible = bool(profile and profile.current_streak >= criteria.get("min_streak", 0))

        if not eligible:
            continue

        _, created = UserAchievement.objects.get_or_create(user=user, achievement=achievement)
        if created:
            granted.append(achievement)
            if achievement.xp_reward:
                add_xp(user, achievement.xp_reward)

    return granted
