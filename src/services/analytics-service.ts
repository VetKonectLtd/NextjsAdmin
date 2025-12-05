import apiClient from '../lib/api-client';
import type { AnalyticsData } from '../types/analytics';

export const analyticsService = {
  getCount: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/v3/admin/get-count');
    return response.data;
  },

  refreshCountCache: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/v3/admin/refresh-count-cache');
    return response.data;
  },
};
