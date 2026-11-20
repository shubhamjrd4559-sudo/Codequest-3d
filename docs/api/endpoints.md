# CodeQuest 3D REST API (v1)

Base URL: `/api/v1/`. Responses and request bodies use JSON unless stated otherwise. Collection endpoints use Django REST Framework page-number pagination with the configured page size (default 20):

```json
{"count": 1, "next": null, "previous": null, "results": []}
```

Protected requests use `Authorization: Bearer <access_token>`. Validation errors use DRF's field-keyed format, for example `{"email": ["Enter a valid email address."]}`. Unauthenticated protected requests return `401`; role-restricted student routes return `403` for an authenticated non-student.

## Authentication

### `POST /auth/register/` — public

Creates a student account and an associated student profile. Role is always set to `student`; a client-supplied role cannot grant admin access.

Request:

```json
{
  "email": "learner@example.com",
  "password": "a-strong-password",
  "password_confirm": "a-strong-password",
  "first_name": "Avery",
  "last_name": "Learner",
  "display_name": "Avery"
}
```

`first_name`, `last_name`, and `display_name` are optional. Passwords are checked with Django's configured password validators. Success: `201 Created` with a user object (no password).

### `POST /auth/token/` — public login

Request:

```json
{"email": "learner@example.com", "password": "a-strong-password"}
```

Success: `200 OK` with `{ "refresh": "…", "access": "…" }`. The JWT includes the user's application `role` claim.

### `POST /auth/token/refresh/` — public refresh

Request: `{ "refresh": "<refresh_token>" }`. Success: `200 OK` with a new access token and, with refresh rotation enabled, a replacement refresh token. The old refresh token is blacklisted.

### `POST /auth/logout/` — authenticated

Request: `{ "refresh": "<refresh_token>" }`. Blacklists that refresh token and returns `204 No Content`. The current access token remains valid until its expiry; clients should discard it on logout.

### `GET /auth/me/` — authenticated

Returns the caller's identity and profile:

```json
{
  "id": 12,
  "email": "learner@example.com",
  "first_name": "Avery",
  "last_name": "Learner",
  "role": "student",
  "student_profile": {
    "display_name": "Avery",
    "avatar_url": "",
    "total_xp": 0,
    "level": 1,
    "current_streak": 0,
    "longest_streak": 0,
    "last_activity_date": null
  },
  "date_joined": "2026-11-20T00:00:00Z"
}
```

`student_profile` is `null` for accounts without a profile (for example an admin account).

## Public read-only catalog

All catalog routes below allow unauthenticated GET requests and return only published/active content. Non-GET methods are not allowed.

| Endpoint | Query filters | Response item fields |
|---|---|---|
| `GET /topics/` and `/topics/{id}/` | — | `id`, `title`, `slug`, `summary`, `description`, `category`, `icon`, `order` |
| `GET /lessons/` and `/lessons/{id}/` | `topic=<topic id or slug>` | `id`, `topic`, `title`, `slug`, `introduction`, `explanation`, `real_life_example`, `cpp_code`, `visualization_config`, `order`, `estimated_minutes` |
| `GET /games/` and `/games/{id}/` | `topic=<topic id or slug>` | `id`, `slug`, `title`, `description`, `learning_objective`, `instructions`, `topics` |
| `GET /game-levels/` and `/game-levels/{id}/` | `game=<game id or slug>` | `id`, `game`, `level_number`, `title`, `difficulty`, `configuration` |
| `GET /video-lectures/` and `/video-lectures/{id}/` | `topic=<topic id or slug>`, `lesson=<lesson id>` | `id`, `topic`, `lesson`, `title`, `youtube_video_id`, `description`, `related_notes`, `order` |

## Public quizzes and questions

### `GET /quizzes/`, `GET /quizzes/{id}/`

Public, published quizzes. Optional `topic=<topic id or slug>` filter. Items contain `id`, `topic`, `lesson`, `title`, `description`, `difficulty`, `timer_seconds`, and `question_count`.

### `GET /questions/`, `GET /questions/{id}/`

Public questions belonging to published quizzes. Optional `quiz=<quiz id>` filter. Question payload:

```json
{
  "id": 31,
  "quiz": 8,
  "prompt": "Which keyword repeats a block?",
  "choices": [{"key": "for", "text": "for"}, {"key": "if", "text": "if"}],
  "points": 1,
  "order": 0
}
```

`correct_answer` and `explanation` are never included in the initial question response.

### `POST /quiz-attempts/` — authenticated

Submits answers for a published quiz. The attempt is always associated with the authenticated account; `user` is not accepted from the client. Every answer key must be a question ID belonging to the specified quiz. Missing answers are scored as incorrect.

Request:

```json
{
  "quiz": 8,
  "answers": {"31": "for", "32": "choice-b"},
  "duration_seconds": 45
}
```

`duration_seconds` is optional and defaults to 0. Success: `201 Created`:

```json
{
  "attempt": {
    "id": 17,
    "quiz": 8,
    "score_percent": "50.00",
    "correct_answers": 1,
    "total_questions": 2,
    "started_at": "2026-11-20T00:00:00Z",
    "completed_at": "2026-11-20T00:00:45Z",
    "duration_seconds": 45
  },
  "feedback": [
    {"question_id": 31, "is_correct": true, "correct_answer": "for", "explanation": "A for loop repeats a block."}
  ]
}
```

Correct answers and explanations are returned only after submission for feedback.

## Achievements

### `GET /achievements/`, `GET /achievements/{id}/` — public

Lists active achievement definitions: `id`, `slug`, `name`, `description`, `icon`, `xp_reward`, and `criteria`.

## Student progress and dashboard

These endpoints require an authenticated student-role account. Client-supplied user IDs are not accepted; records are attached to the bearer-token user.

### `POST /lessons/{id}/complete/`

Marks a published lesson complete. No request body is required. Creates or updates that student's progress row. Success returns `id`, `lesson`, `lesson_title`, `status`, `progress_percent`, `started_at`, `last_accessed_at`, and `completed_at`; new rows return `201`, existing rows return `200`.

### `POST /game-attempts/`

Creates a game attempt for an active game. Request:

```json
{
  "game": 4,
  "level": 11,
  "score": 80,
  "max_score": 100,
  "completed": true,
  "duration_seconds": 73,
  "result_data": {"moves": 6}
}
```

`level`, `max_score`, `completed`, `duration_seconds`, and `result_data` are optional. If a level is supplied it must belong to the chosen game; score cannot be negative or exceed a supplied `max_score`. Success returns `201 Created` with the attempt fields and `game_title`.

**Scoring limitation:** game score/result data is currently accepted from the client after basic consistency checks. It is not proof of gameplay and must not be used for security-sensitive rewards until server-verifiable scoring is implemented.

### `GET /dashboard/summary/`

Returns the current student's summary: `student` identity, `current_xp`, `level`, `current_streak`, `completed_lessons`, `in_progress_lessons`, `total_published_lessons`, up to five `recent_game_scores`, up to five `recent_quiz_attempts`, and up to ten earned `achievements`.

## Role and permission summary

- Registration always creates a `student`; the client cannot assign its role.
- Student-only progress, game-attempt and dashboard routes require a student role.
- Admin accounts can access authenticated identity and logout routes, but these Phase 4 endpoints do not add admin content-management APIs.
- Catalog, quiz/question and achievement reads are public and expose published/active records only.
- DRF pagination applies to list endpoints.
