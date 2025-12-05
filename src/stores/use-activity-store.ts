import { create } from "zustand";
import type { Activity } from "@/types/activities";
import { activityService } from "@/services/activity-service";

interface ActivityState {
  activities: Activity[] | null;
  isLoading: boolean;
  error: string | null;

  fetchActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
}

const formatError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export const useActivityStore = create<ActivityState>((set) => ({
  activities: null,
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await activityService.getActivities();
      set({ activities: response.activities, isLoading: false });
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchActivities: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await activityService.searchActivities(query);
      set({ activities: response.activities, isLoading: false });
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
