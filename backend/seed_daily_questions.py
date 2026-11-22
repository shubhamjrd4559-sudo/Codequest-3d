"""Idempotently seed the ordered 200-question daily C++ quiz queue."""

import json
import os
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from django.db import transaction  # noqa: E402

from apps.assessments.models import DailyQuestion  # noqa: E402


DATA_PATH = Path(__file__).with_name("daily_questions.json")
EXPECTED_POSITIONS = list(range(1, 201))


def load_questions():
    questions = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    positions = [item.get("position") for item in questions]
    if positions != EXPECTED_POSITIONS:
        raise ValueError("daily_questions.json must contain positions 1 through 200 in order.")
    for item in questions:
        if item.get("correct_answer") not in {"A", "B", "C", "D"}:
            raise ValueError(f"Invalid correct answer at position {item.get('position')}.")
        if not all(item.get(field) for field in ("question_text", "option_a", "option_b", "option_c", "option_d")):
            raise ValueError(f"Question {item.get('position')} is missing its text or one of its options.")
    return questions


@transaction.atomic
def seed():
    questions = load_questions()
    for item in questions:
        DailyQuestion.objects.update_or_create(position=item["position"], defaults=item)
    DailyQuestion.objects.exclude(position__in=EXPECTED_POSITIONS).delete()
    return DailyQuestion.objects.count()


if __name__ == "__main__":
    print(f"Seeded {seed()} ordered daily questions.")
