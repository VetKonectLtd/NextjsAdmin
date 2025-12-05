import apiClient from "@/lib/api-client";
import type { ActivitiesResponse } from "@/types/activities";

export const activityService = {
  getActivities: async (): Promise<ActivitiesResponse> => {
    const response = await apiClient.get('/v3/admin/admin-activity');
    return response.data;
  },

  searchActivities: async (query: string): Promise<ActivitiesResponse> => {
    const response = await apiClient.get(`/v3/admin/search-admin-activity?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
