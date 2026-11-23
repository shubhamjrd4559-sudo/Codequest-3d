import apiClient from "./client";
import { HeatmapDay } from "./types";

export const userApi = {
  async getHeatmap(): Promise<HeatmapDay[]> {
    const res = await apiClient.get<HeatmapDay[]>("/user/heatmap/");
    return res.data;
  },
};
