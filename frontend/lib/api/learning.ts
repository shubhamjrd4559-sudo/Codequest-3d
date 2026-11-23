import apiClient from "./client";

export interface LearningPathLesson {
  id: number;
  title: string;
  slug: string;
  order: number;
  estimated_minutes: number;
  is_completed: boolean;
  completed_at: string | null;
  has_content: boolean;
  chapter_id: number | null;
}

export interface LearningPathChapter {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  lessons: LearningPathLesson[];
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
}

export interface LearningPathModule {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  lessons: LearningPathLesson[];
  chapters: LearningPathChapter[];
  completed_lessons: number;
  total_lessons: number;
  progress_percent: number;
}

export type LessonPageData = {
  id: number;
  title: string;
  slug: string;
  introduction: string;
  explanation: string;
  real_life_example: string;
  cpp_code: string;
  lesson_content: Record<string, unknown>;
  estimated_minutes: number;
  is_completed: boolean;
  is_bookmarked: boolean;
  module: { id: number; title: string; slug: string };
  chapter: { id: number; title: string; slug: string } | null;
  previous: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
};

export type LessonSearchResult = { id: number; title: string; topic: string; slug: string };

export interface LearningPathData {
  modules: LearningPathModule[];
  completed_lessons: number;
  total_lessons: number;
  course_progress: number;
}

export interface LessonProgressResult extends LearningPathLesson {
  lesson: number;
  lesson_title: string;
  status: "not_started" | "in_progress" | "completed";
  progress_percent: number;
  started_at: string | null;
  last_accessed_at: string | null;
  course_progress: number;
  completed_lessons: number;
  total_lessons: number;
  xp_awarded: number;
  total_xp: number;
}

export const learningApi = {
  async getPath(): Promise<LearningPathData> {
    const response = await apiClient.get<LearningPathData>("/learning/path/");
    return response.data;
  },
  async toggleLesson(lessonId: number): Promise<LessonProgressResult> {
    const response = await apiClient.post<LessonProgressResult>(`/progress/lesson/${lessonId}/toggle/`, {});
    return response.data;
  },
  async getLesson(lessonId: number): Promise<LessonPageData> {
    const response = await apiClient.get<LessonPageData>(`/learning/lessons/${lessonId}/`);
    return response.data;
  },
  async toggleBookmark(lessonId: number): Promise<boolean> {
    const response = await apiClient.post<{ is_bookmarked: boolean }>(`/learning/lessons/${lessonId}/bookmark/`, {});
    return response.data.is_bookmarked;
  },
  async searchLessons(query: string): Promise<LessonSearchResult[]> {
    const response = await apiClient.get<{ results: LessonSearchResult[] }>("/learning/search/", { params: { q: query } });
    return response.data.results;
  },
};
