import apiClient from "./client";
import { DashboardSummary } from "./types";

export const dashboardApi = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await apiClient.get<DashboardSummary>("/dashboard/summary/");
    return res.data;
  },
};
