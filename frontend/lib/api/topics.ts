import apiClient from "./client";
import { Topic } from "./types";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const topicsApi = {
  async getAll(): Promise<PaginatedResponse<Topic>> {
    const res = await apiClient.get<PaginatedResponse<Topic>>("/topics/");
    return res.data;
  },

  async getBySlug(slug: string): Promise<Topic> {
    const res = await apiClient.get<Topic>(`/topics/${slug}/`);
    return res.data;
  },
};
