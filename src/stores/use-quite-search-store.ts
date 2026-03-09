import { create } from "zustand";
import { formatError } from "../lib/error-utils";
import { toast } from "sonner";
import { quiteSearchService } from "@/services/quite-search";


interface QuiteSearchUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface QuiteSearchState {
  users: QuiteSearchUser[] | null;
  isLoading: boolean;
  error: string | null;

  fetchUsersFromDate: (from:string, to: string) => Promise<void>;
  clearResults: () => void;
}

export const useQuiteSearchStore = create<QuiteSearchState>((set) => ({
  users: null,
  isLoading: false,
  error: null,

  fetchUsersFromDate: async (from:string, to:string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await quiteSearchService.getUsersFrom(from, to);

      set({
        users: response,
        isLoading: false,
      });

      if (!response || response.length === 0) {
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

  clearResults: () => {
    set({ users: null, error: null });
  },
}));