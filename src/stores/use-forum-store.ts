import { create } from 'zustand';
import { forumService } from '@/services/forum-service';
import type { ForumsResponse } from '@/types/forums';
import { formatError } from '@/lib/error-utils';
import { toast } from 'sonner';

interface ForumState {
  forums: ForumsResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchForums: (page?: number) => Promise<void>;
  searchForums: (query: string) => Promise<void>;
  approveForum: (forumChatId: number, userId: string, userRole: string) => Promise<void>;
  rejectForum: (forumChatId: number, userId: string, userRole: string) => Promise<void>;
  deleteForum: (id: number) => Promise<void>;
}

export const useForumStore = create<ForumState>((set, get) => ({
  forums: null,
  isLoading: false,
  error: null,

  fetchForums: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await forumService.getForums(page);
      set({ forums: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  searchForums: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await forumService.searchForums(query);
      set({ forums: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  approveForum: async (forumChatId: number, userId: string, userRole: string) => {
    try {
      await forumService.approveForum(forumChatId, userId, userRole);
      toast.success("Forum approved successfully");
      // Refresh list
      const state = get();
      state.fetchForums(state.forums?.current_page);
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  rejectForum: async (forumChatId: number, userId: string, userRole: string) => {
    try {
      await forumService.rejectForum(forumChatId, userId, userRole);
      toast.success("Forum rejected successfully");
      // Refresh list
      const state = get();
      state.fetchForums(state.forums?.current_page);
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  deleteForum: async (id: number) => {
    try {
      await forumService.deleteForum(id);
      toast.success("Forum deleted successfully");
      // Refresh list
      const state = get();
      state.fetchForums(state.forums?.current_page);
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  }
}));
