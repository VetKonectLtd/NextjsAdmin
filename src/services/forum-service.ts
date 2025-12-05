import apiClient from '@/lib/api-client';
import type { ForumsResponse } from '@/types/forums';

export const forumService = {
  getForums: async (page = 1) => {
    const response = await apiClient.get<ForumsResponse>(`/v3/admin/forums?page=${page}`);
    return response.data;
  },

  searchForums: async (query: string) => {
    const response = await apiClient.get<ForumsResponse>(`/v3/admin/forums/search?query=${query}`);
    return response.data;
  },

  approveForum: async (forumChatId: number, userId: string, userRole: string) => {
    const response = await apiClient.post('/v3/admin/forums/approve', { 
      forum_chat_id: forumChatId,
      user_id: userId,
      user_role: userRole
    });
    return response.data;
  },

  rejectForum: async (forumChatId: number, userId: string, userRole: string) => {
    const response = await apiClient.post('/v3/admin/forums/reject', { 
      forum_chat_id: forumChatId,
      user_id: userId,
      user_role: userRole
    });
    return response.data;
  },

  deleteForum: async (id: number) => {
    const response = await apiClient.delete(`/v3/admin/forums/${id}/delete`);
    return response.data;
  },

  flagComment: async (id: number) => {
    const response = await apiClient.put(`/v3/admin/forums/comments/${id}/flag`);
    return response.data;
  }
};
