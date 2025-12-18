import apiClient from "@/lib/api-client";
import type { BlogsResponse, FlagBlogPayload } from "@/types/blog";

export const blogService = {
  // Get all blogs (paginated)
  getAllBlogs: async (page = 1): Promise<BlogsResponse> => {
    const response = await apiClient.get<BlogsResponse>(
      `/v3/admin/get-all-blog?page=${page}`
    );
    return response.data;
  },

  // Create a new blog (FormData for file upload)
  createBlog: async (formData: FormData): Promise<void> => {
    await apiClient.post("/v3/admin/blogs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update a blog (FormData for file upload)
  updateBlog: async (id: number, formData: FormData): Promise<void> => {
    await apiClient.post(`/v3/admin/update-blog/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Delete a blog
  deleteBlog: async (id: number): Promise<void> => {
    await apiClient.delete(`/v3/admin/delete-blog/${id}`);
  },

  // Get deleted blogs
  getDeletedBlogs: async (): Promise<BlogsResponse> => {
    const response = await apiClient.get<BlogsResponse>(
      "/v3/admin/blogs/deleted"
    );
    return response.data;
  },

  // Restore a deleted blog
  restoreBlog: async (id: number): Promise<void> => {
    await apiClient.get(`/v3/admin/blogs/restore/${id}`);
  },

  // Publish a blog
  publishBlog: async (id: number): Promise<void> => {
    await apiClient.post(`/v3/admin/blogs/${id}/publish`);
  },

  // Archive a blog
  archiveBlog: async (id: number): Promise<void> => {
    await apiClient.post(`/v3/admin/blogs/${id}/archive`);
  },

  // Reject a blog
  rejectBlog: async (id: number): Promise<void> => {
    await apiClient.post(`/v3/admin/blogs/${id}/reject`);
  },

  // Flag a comment
  flagComment: async (id: number, payload: FlagBlogPayload): Promise<void> => {
    await apiClient.put(`/v3/admin/blogs/${id}/flag`, payload);
  },
};
