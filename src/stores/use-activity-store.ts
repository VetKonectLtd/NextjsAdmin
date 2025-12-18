import { create } from "zustand";
import type { Activity } from "@/types/activities";
import { activityService } from "@/services/activity-service";

interface ActivityState {
  activities: Activity[] | null;
  allActivities: Activity[] | null;
  isLoading: boolean;
  error: string | null;

  fetchActivities: () => Promise<void>;
  searchActivities: (query: string) => Promise<void>;
}

const formatError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: null,
  allActivities: null,
  isLoading: false,
  error: null,

  fetchActivities: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await activityService.getActivities();
      set({
        activities: response.activities,
        allActivities: response.activities,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchActivities: async (query: string) => {
    // Client-side filtering
    const { allActivities } = get();
    const allData = allActivities || [];

    if (!query.trim()) {
      set({ activities: allData });
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allData.filter((item: Activity) => {
      const title = item.title?.toLowerCase() || "";
      const detail = item.detail?.toLowerCase() || "";
      const action = item.action?.toLowerCase() || "";

      return (
        title.includes(lowerQuery) ||
        detail.includes(lowerQuery) ||
        action.includes(lowerQuery)
      );
    });

    set({ activities: filtered });
  },
}));
