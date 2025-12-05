import { create } from 'zustand';
import { analyticsService } from '../services/analytics-service';
import { formatError } from '../lib/error-utils';
import type { AnalyticsData } from '../types/analytics';

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  
  fetchAnalytics: () => Promise<void>;
  refreshAnalytics: () => Promise<void>;
}

const initialData: AnalyticsData = {
  veterinaryDoctor: 0,
  veterinaryClinic: 0,
  veterinaryParaprofessional: 0,
  pet_owner: 0,
  vendor: 0,
  livestock_farmer: 0,
  other: 0,
  users: 0,
  pets: 0,
  farms: 0,
  clinics: 0,
  stores: 0,
  products: 0,
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.getCount();
      set({ data, isLoading: false });
    } catch (error) {
      set({ 
        error: formatError(error), 
        isLoading: false,
        data: initialData 
      });
    }
  },

  refreshAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await analyticsService.refreshCountCache();
      set({ data, isLoading: false });
    } catch (error) {
      set({ 
        error: formatError(error), 
        isLoading: false 
      });
    }
  },
}));
