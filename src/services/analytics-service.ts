import apiClient from '../lib/api-client';
import type { AnalyticsData, CountryAnalyticsData } from '../types/analytics';

export const analyticsService = {
  getCount: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/v3/admin/get-count');
    return response.data;
  },

  refreshCountCache: async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/v3/admin/refresh-count-cache');
    return response.data;
  },

  getCountByCountry: async (country: string): Promise<CountryAnalyticsData> => {
    const response = await apiClient.get<CountryAnalyticsData>(`/v3/admin/get-count-by-country?country=${country}`);
    return response.data;
  },
};
