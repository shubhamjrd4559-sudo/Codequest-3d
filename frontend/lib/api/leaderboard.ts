import apiClient from "./client";
import { LeaderboardUser } from "./types";

export const leaderboardApi = {
  async getTopStudents(): Promise<LeaderboardUser[]> {
    const res = await apiClient.get<LeaderboardUser[]>("/leaderboard/");
    return res.data;
  },
};
