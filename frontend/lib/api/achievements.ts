import apiClient from "./client";
import { AchievementItemData } from "./types";

export const achievementsApi = {
  async getAll(): Promise<AchievementItemData[]> {
    const res = await apiClient.get<{ count: number; results: AchievementItemData[] } | AchievementItemData[]>("/achievements/");
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return res.data.results || [];
  },
};
