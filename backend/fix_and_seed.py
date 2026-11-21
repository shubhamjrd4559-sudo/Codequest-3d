"""Validate, repair, and seed the 26-topic, four-level quiz dataset."""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import quote_plus

import django
from django.db import transaction
from django.utils.text import slugify


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "quiz_data.json"
LEVEL_NAMES = {
    1: ("Foundation", "easy"),
    2: ("Core Logic", "easy"),
    3: ("Pattern Builder", "medium"),
    4: ("Grandmaster", "medium"),
}
EXPECTED_TOPICS = 26
QUESTIONS_PER_TOPIC = 4
PLAYLIST_VIDEO_ID = "VTLCoHnyACE"
PLAYLIST_URL = "https://www.youtube.com/watch?v=VTLCoHnyACE&list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt"

def load_concatenated_json(path: Path) -> list[dict]:
    """Accept a normal JSON array or adjacent JSON arrays from the supplied text file."""
    text = path.read_text(encoding="utf-8-sig")
    decoder = json.JSONDecoder()
    cursor = 0
    groups = []
    while cursor < len(text):
        while cursor < len(text) and text[cursor].isspace():
            cursor += 1
        if cursor == len(text):
            break
        value, cursor = decoder.raw_decode(text, cursor)
        groups.append(value)
    rows = []
    for group in groups:
        if isinstance(group, list):
            rows.extend(group)
        elif isinstance(group, dict):
            rows.append(group)
        else:
            raise ValueError("Quiz data must contain question objects or arrays of question objects.")
    return rows


def repair_and_validate(rows: list[dict]) -> list[dict]:
    if len(rows) != EXPECTED_TOPICS * QUESTIONS_PER_TOPIC:
        raise ValueError(f"Expected 104 questions; found {len(rows)}.")

    topic_names = {row.get("topic_name") for row in rows}
    if len(topic_names) != EXPECTED_TOPICS:
        raise ValueError(f"Expected 26 distinct topics; found {len(topic_names)}.")

    counts: dict[str, list[int]] = {}
    for row in rows:
        topic = row.get("topic_name")
        level = row.get("level")
        counts.setdefault(topic, []).append(level)

        answer = row.get("correct_answer")
        options = row.get("options")
        if not isinstance(row.get("question"), str) or not row["question"].strip():
            raise ValueError(f"Empty question: {topic} level {level}.")
        if not isinstance(options, list) or len(options) != 4:
            raise ValueError(f"Expected four options: {topic} level {level}.")
        option_keys = [re.match(r"^([A-D])\)\s+", option).group(1) if isinstance(option, str) and re.match(r"^([A-D])\)\s+", option) else None for option in options]
        if option_keys != list("ABCD"):
            raise ValueError(f"Options must be labeled A, B, C, D in order: {topic} level {level}.")
        if not isinstance(answer, str) or answer not in "ABCD" or answer not in option_keys:
            raise ValueError(f"Invalid correct_answer for {topic} level {level}: {answer!r}.")
        explanation = row.get("explanation", "")
        stated_keys = re.findall(r"option\s+([A-D])\s+is\s+(?:the\s+)?correct", explanation, re.I)
        stated_keys += re.findall(r"correct answer is\s+(?:option\s+)?([A-D])", explanation, re.I)
        if any(key.upper() != answer for key in stated_keys):
            raise ValueError(f"Explanation contradicts answer key for {topic} level {level}: {stated_keys} vs {answer}.")
        if not re.search(r"^Coding use:", explanation, re.M):
            raise ValueError(f"Missing coding-use explanation for {topic} level {level}.")
        if re.search(r"invalid as written|options are incorrect|none of the (given )?options", explanation + " " + row["question"], re.I):
            raise ValueError(f"Unrepaired invalid question: {topic} level {level}.")

    for topic, levels in counts.items():
        if sorted(levels) != [1, 2, 3, 4]:
            raise ValueError(f"{topic} must contain levels 1, 2, 3, and 4; found {levels}.")

    rows.sort(key=lambda row: (row["topic_id"], row["level"]))
    return rows


def seed(rows: list[dict]) -> None:
    sys.path.insert(0, str(BASE_DIR))
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    from apps.assessments.models import Question, Quiz
    from apps.catalog.models import Topic, VideoLecture

    names = sorted({(row["topic_id"], row["topic_name"]) for row in rows})
    corrected_samples = [
        ("Basic Mathematics & Number Theory", 4),
        ("Heaps / Priority Queues", 4),
        ("Tries", 4),
    ]
    sample_rows = []

    with transaction.atomic():
        topic_by_name = {}
        for topic_id, name in names:
            slug = slugify(name)
            topic, _ = Topic.objects.update_or_create(
                slug=slug,
                defaults={
                    "title": name,
                    "summary": f"Learn {name} through clear explanations, examples, and progressive practice.",
                    "description": f"A four-level introduction to {name}, from foundation concepts to advanced patterns.",
                    "category": "Data Structures & Algorithms",
                    "order": topic_id,
                    "is_published": True,
                },
            )
            topic_by_name[name] = topic
            search_url = "https://www.youtube.com/results?search_query=Apna+College+Shradha+Khapra+" + quote_plus(name)
            VideoLecture.objects.update_or_create(
                topic=topic,
                title=f"Apna College — {name}",
                defaults={
                    "lesson": None,
                    "youtube_video_id": PLAYLIST_VIDEO_ID,
                    "search_url": search_url,
                    "description": f"Search Apna College (Shradha Khapra) lessons for {name}.",
                    "related_notes": f"Recommended topic search: {search_url}\nCore playlist: {PLAYLIST_URL}",
                    "order": 0,
                    "is_published": True,
                },
            )

        for row in rows:
            topic_name = row["topic_name"]
            level = row["level"]
            topic = topic_by_name[topic_name]
            level_name, difficulty = LEVEL_NAMES[level]
            quiz_title = f"{topic_name} — {level_name}"
            quiz, _ = Quiz.objects.update_or_create(
                topic=topic,
                title=quiz_title,
                defaults={
                    "lesson": None,
                    "description": f"Level {level}: {level_name}",
                    "difficulty": difficulty,
                    "timer_seconds": 60,
                    "is_published": True,
                },
            )
            choices = [
                {"key": option[0], "text": option[3:].strip()}
                for option in row["options"]
            ]
            question, _ = Question.objects.update_or_create(
                quiz=quiz,
                order=0,
                defaults={
                    "prompt": row["question"],
                    "choices": choices,
                    "correct_answer": row["correct_answer"],
                    "explanation": row["explanation"],
                    "points": level,
                },
            )
            if (topic_name, level) in corrected_samples:
                sample_rows.append((topic_name, level_name, question, choices))

    DATA_PATH.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Seeded topic records: {len(names)}")
    print(f"Database totals — topics: {Topic.objects.count()}, videos: {VideoLecture.objects.count()}, questions: {Question.objects.count()}")
    print("Corrected sample questions:")
    for topic_name, level_name, question, choices in sample_rows:
        print(f"- {topic_name} / {level_name}: {question.prompt}")
        print(f"  Correct: {question.correct_answer}; {question.explanation}")


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Missing source data: {DATA_PATH}")
    rows = repair_and_validate(load_concatenated_json(DATA_PATH))
    seed(rows)


if __name__ == "__main__":
    main()
