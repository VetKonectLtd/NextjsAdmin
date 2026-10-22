import { create } from "zustand";
import { formatError } from "../lib/error-utils";
import { toast } from "sonner";
import { quickSearchService } from "@/services/quick-search";
import type { QuickSearchResponse } from "@/services/quick-search";

interface QuickSearchState {
  users: QuickSearchResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchUsersFromDate: (from: string, to: string) => Promise<void>;
  loadMoreUsersFromDate: (from: string, to: string) => Promise<void>;
  clearResults: () => void;
}

export const useQuickSearchStore = create<QuickSearchState>((set, get) => ({
  users: null,
  isLoading: false,
  error: null,

  fetchUsersFromDate: async (from: string, to: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await quickSearchService.getUsersFrom(from, to, 1);

      set({
        users: response,
        isLoading: false,
      });

      if (response.user.data.length === 0) {
        toast.info("No users found for this date range");
      }
    } catch (error) {
      const errorMessage = formatError(error);

      set({
        error: errorMessage,
        isLoading: false,
      });

      toast.error(errorMessage);
    }
  },

  loadMoreUsersFromDate: async (from: string, to: string) => {
    const current = get().users;
    if (!current || !current.user.next_page_url || get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const response = await quickSearchService.getUsersFrom(
        from,
        to,
        current.user.current_page + 1,
      );

      set((state) => {
        if (!state.users) {
          return { users: response, isLoading: false };
        }

        const byId = new Map(
          state.users.user.data.map((user) => [user.id, user]),
        );
        for (const user of response.user.data) {
          byId.set(user.id, user);
        }

        return {
          users: {
            user: {
              ...response.user,
              data: Array.from(byId.values()),
            },
          },
          isLoading: false,
        };
      });
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  clearResults: () => {
    set({ users: null, error: null });
  },
}));