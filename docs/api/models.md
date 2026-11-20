# CodeQuest 3D database models

The Django models use PostgreSQL in configured deployments. The initial migration was generated and applied locally using SQLite because no local PostgreSQL service was configured. Set `DATABASE_ENGINE=postgres` and provide the `POSTGRES_*` values in the backend environment to use PostgreSQL.

All tables use Django's `BigAutoField` primary key unless noted otherwise. Timestamp fields are stored with timezone support. `CASCADE` means dependent learner/content records are deleted with their parent; `SET_NULL` preserves the record while clearing an optional relationship.

## Accounts (`apps.accounts`)

### `User`

Custom authentication model based on Django `AbstractUser`; email is the unique login identifier and `username` is removed.

| Field | Type | Notes |
|---|---|---|
| `id` | BigAutoField | Primary key |
| `email` | EmailField | Required, unique; `USERNAME_FIELD` |
| `password` | Django password field | Hashed by Django's authentication system |
| `first_name`, `last_name` | CharField | Inherited from `AbstractUser` |
| `role` | CharField(20) | `student` (default) or `admin`; indexed |
| `is_active` | BooleanField | Inherited; controls account availability |
| `is_staff`, `is_superuser` | BooleanField | Inherited Django administrative flags |
| `is_authenticated`, `last_login`, `date_joined` | Inherited properties/fields | Standard Django authentication metadata |
| `groups`, `user_permissions` | Many-to-many | Inherited Django authorization relations |
| `created_at`, `updated_at` | DateTimeField | Creation/update timestamps |

`UserManager` creates email-based accounts and sets admin/superuser defaults for superusers. Index: `(role, is_active)`. The role is an application role; API permissions must still enforce access on the server.

### `StudentProfile`

One-to-one with `User` through `user` (`CASCADE`, reverse name `student_profile`). Intended for student-specific profile and dashboard metrics.

| Field | Type | Notes |
|---|---|---|
| `display_name` | CharField(80) | Optional learner display name |
| `avatar_url` | URLField | Optional avatar URL |
| `total_xp` | PositiveIntegerField | Defaults to 0 |
| `level` | PositiveIntegerField | Defaults to 1; minimum 1 |
| `current_streak`, `longest_streak` | PositiveIntegerField | Defaults to 0 |
| `last_activity_date` | DateField | Nullable |
| `created_at`, `updated_at` | DateTimeField | Timestamps |

## Catalog (`apps.catalog`)

`Topic`, `Lesson`, `Game`, `GameLevel` and `VideoLecture` inherit `created_at` and `updated_at` from an abstract timestamp model.

### `Topic`

| Field | Type | Notes |
|---|---|---|
| `title` | CharField(160) | Display title |
| `slug` | SlugField(180) | Unique URL key |
| `summary` | CharField(300) | Short summary |
| `description` | TextField | Optional longer introduction |
| `category`, `icon` | CharField | Optional grouping and presentation metadata |
| `order` | PositiveIntegerField | Curriculum sort order |
| `is_published` | BooleanField | Defaults false; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Index: `(is_published, order)`. A topic has many lessons, quizzes and lectures. Games may link to multiple topics.

### `Lesson`

Belongs to `Topic` by `topic` (`CASCADE`, reverse name `lessons`).

| Field | Type | Notes |
|---|---|---|
| `title` | CharField(160) | Lesson title |
| `slug` | SlugField(180) | Unique within the topic |
| `introduction`, `explanation`, `real_life_example` | TextField | Lesson teaching content |
| `cpp_code` | TextField | Optional C++ example |
| `visualization_config` | JSONField | Defaults to an empty object |
| `order` | PositiveIntegerField | Sort order within topic |
| `estimated_minutes` | PositiveSmallIntegerField | Defaults to 5; range 1–240 |
| `is_published` | BooleanField | Defaults false; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Constraint: unique `(topic, slug)`. Index: `(topic, is_published, order)`. A lesson may have progress rows, quizzes and lectures.

### `Game`

| Field | Type | Notes |
|---|---|---|
| `slug` | SlugField(100) | Unique game identifier |
| `title` | CharField(160) | Display title |
| `description` | TextField | Game overview |
| `learning_objective` | CharField(300) | Intended learning outcome |
| `topics` | ManyToManyField to `Topic` | Optional associations; blank allowed |
| `instructions` | TextField | Optional player instructions |
| `is_active` | BooleanField | Defaults true; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

A game has many levels and game attempts.

### `GameLevel`

Belongs to `Game` through `game` (`CASCADE`, reverse name `levels`).

| Field | Type | Notes |
|---|---|---|
| `level_number` | PositiveSmallIntegerField | Minimum 1 |
| `title` | CharField(160) | Level title |
| `difficulty` | CharField(10) | `easy`, `medium` or `hard`; defaults `easy`; indexed |
| `configuration` | JSONField | Defaults to an empty object for level-specific setup |
| `is_active` | BooleanField | Defaults true; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Constraint: unique `(game, level_number)`. Index: `(game, is_active, level_number)`.

### `VideoLecture`

Belongs to `Topic` through `topic` (`CASCADE`). Optional `lesson` uses `SET_NULL`, so a lecture can remain topic-level or survive lesson removal.

| Field | Type | Notes |
|---|---|---|
| `title` | CharField(200) | Lecture title |
| `youtube_video_id` | CharField(11) | Validated as an 11-character YouTube identifier |
| `description`, `related_notes` | TextField | Optional lecture information |
| `order` | PositiveIntegerField | Sort order |
| `is_published` | BooleanField | Defaults false; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Index: `(topic, is_published, order)`. Model validation ensures an optional lesson belongs to the selected topic. Supply real video IDs through content management; the model does not invent video content.

## Assessments (`apps.assessments`)

`Quiz` and `Question` inherit `created_at` and `updated_at` from an abstract timestamp model.

### `Quiz`

Belongs to `Topic` (`CASCADE`) and optionally `Lesson` (`SET_NULL`). Model validation checks that the optional lesson belongs to the same topic.

| Field | Type | Notes |
|---|---|---|
| `title` | CharField(180) | Quiz title |
| `description` | TextField | Optional description |
| `difficulty` | CharField(10) | `easy` or `medium`; defaults `easy`; indexed |
| `timer_seconds` | PositiveIntegerField | Nullable; range 1–7200 when set |
| `is_published` | BooleanField | Defaults false; indexed |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Index: `(topic, is_published, difficulty)`. A quiz has ordered questions and user attempts.

### `Question`

Belongs to `Quiz` through `quiz` (`CASCADE`).

| Field | Type | Notes |
|---|---|---|
| `prompt` | TextField | Question prompt |
| `choices` | JSONField | Ordered choices with stable keys and display text |
| `correct_answer` | CharField(100) | Key of the correct choice; do not expose before submission |
| `explanation` | TextField | Optional feedback explanation |
| `points` | PositiveSmallIntegerField | Defaults to 1; minimum 1 |
| `order` | PositiveIntegerField | Sort order |
| `created_at`, `updated_at` | DateTimeField | Inherited timestamps |

Index: `(quiz, order)`.

### `QuizAttempt`

Belongs to `User` (`CASCADE`) and `Quiz` (`CASCADE`).

| Field | Type | Notes |
|---|---|---|
| `answers` | JSONField | Submitted answer map; defaults to empty object |
| `score_percent` | DecimalField(5,2) | Defaults 0; range 0–100 |
| `correct_answers`, `total_questions` | PositiveSmallIntegerField | Attempt counts |
| `started_at` | DateTimeField | Automatically set at creation |
| `completed_at` | DateTimeField | Nullable completion timestamp |
| `duration_seconds` | PositiveIntegerField | Defaults to 0 |

Indexes: `(user, -started_at)` and `(quiz, -started_at)`. APIs must return learner-safe question representations so `correct_answer` is not disclosed prematurely.

## Learning (`apps.learning`)

### `UserProgress`

Belongs to `User` (`CASCADE`) and `Lesson` (`CASCADE`).

| Field | Type | Notes |
|---|---|---|
| `status` | CharField(20) | `not_started`, `in_progress` or `completed`; defaults `not_started`; indexed |
| `progress_percent` | PositiveSmallIntegerField | Defaults 0; range 0–100 |
| `started_at`, `last_accessed_at`, `completed_at` | DateTimeField | Nullable progress timestamps |
| `updated_at` | DateTimeField | Automatically updated |

Constraint: one row per `(user, lesson)`. Indexes: `(user, status)` and `(lesson, status)`.

### `GameAttempt`

Belongs to `User` (`CASCADE`), `Game` (`CASCADE`) and optionally `GameLevel` (`SET_NULL`).

| Field | Type | Notes |
|---|---|---|
| `score` | PositiveIntegerField | Defaults to 0 |
| `max_score` | PositiveIntegerField | Optional maximum score |
| `completed` | BooleanField | Defaults false |
| `duration_seconds` | PositiveIntegerField | Defaults to 0 |
| `result_data` | JSONField | Defaults to empty object for game-specific result details |
| `created_at` | DateTimeField | Automatically set at creation |

Indexes: `(user, -created_at)` and `(game, -created_at)`. API logic must validate score submissions instead of trusting client values.

## Achievements (`apps.achievements`)

### `Achievement`

| Field | Type | Notes |
|---|---|---|
| `slug` | SlugField(100) | Unique identifier |
| `name` | CharField(120) | Display name |
| `description` | TextField | Award description |
| `icon` | CharField(80) | Optional icon key |
| `xp_reward` | PositiveIntegerField | Defaults to 0 |
| `criteria` | JSONField | Defaults to empty object for award criteria |
| `is_active` | BooleanField | Defaults true; indexed |
| `created_at`, `updated_at` | DateTimeField | Timestamps |

### `UserAchievement`

Join record between `User` (`CASCADE`) and `Achievement` (`CASCADE`).

| Field | Type | Notes |
|---|---|---|
| `earned_at` | DateTimeField | Automatically set at award time |
| `metadata` | JSONField | Defaults to empty object for award context |

Constraint: unique `(user, achievement)`. Index: `(user, -earned_at)`.

## Analytics (`apps.analytics`)

The app is registered and scaffolded but intentionally has no models yet. Analytics should initially aggregate from source records such as progress, quiz attempts and game attempts; dedicated rollup models can be added when requirements and query volume justify them.

## Referential overview

```text
User ──1:1── StudentProfile
User ──1:N── QuizAttempt ──N:1── Quiz ──1:N── Question
User ──1:N── UserProgress ──N:1── Lesson ──N:1── Topic
User ──1:N── GameAttempt ──N:1── Game ──1:N── GameLevel
User ──N:M── Achievement (through UserAchievement)
Topic ──1:N── Lesson / Quiz / VideoLecture
Topic ──N:M── Game
Lesson ──0:N── Quiz / VideoLecture
```
