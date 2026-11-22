export interface StudentProfile {
  display_name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "student" | "admin";
  student_profile?: StudentProfile;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
}

export interface DashboardSummary {
  student: {
    id: number;
    email: string;
    display_name: string;
  };
  current_xp: number;
  total_xp?: number;
  level: number;
  current_streak: number;
  is_daily_quiz_completed?: boolean;
  completed_lessons: number;
  in_progress_lessons: number;
  total_published_lessons: number;
  recent_game_scores: Array<{
    id?: number;
    game_name?: string;
    score?: number;
    completed_at?: string;
  }>;
  recent_quiz_attempts: Array<{
    id?: number;
    quiz_title?: string;
    score?: number;
    completed_at?: string;
  }>;
  achievements: Array<{
    id: number | string;
    name: string;
    description: string;
    icon?: string;
    xp_reward?: number;
    unlocked_at?: string;
  }>;
}

export interface Lesson {
  id: number;
  topic?: number | string;
  title: string;
  slug: string;
  order: number;
  introduction?: string;
  explanation?: string;
  real_life_example?: string;
  code_example?: string;
  programming_language?: string;
  video_url?: string;
  is_published?: boolean;
}

export interface Topic {
  id: number;
  title: string;
  slug: string;
  description: string;
  category?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  order?: number;
  icon?: string;
  is_published?: boolean;
  lessons?: Lesson[];
  lessons_count?: number;
  total_xp?: number;
}
