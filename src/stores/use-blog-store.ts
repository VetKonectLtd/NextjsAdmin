import { create } from "zustand";
import { blogService } from "@/services/blog-service";
import type { Blog, CreateBlogPayload, BlogFlagType } from "@/types/blog";
import { toast } from "sonner";

interface BlogState {
  // State
  blogs: Blog[];
  deletedBlogs: Blog[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBlogs: (page?: number) => Promise<void>;
  fetchDeletedBlogs: () => Promise<void>;
  createBlog: (data: CreateBlogPayload) => Promise<void>;
  updateBlog: (id: number, data: CreateBlogPayload) => Promise<void>;
  deleteBlog: (id: number) => Promise<void>;
  restoreBlog: (id: number) => Promise<void>;
  publishBlog: (id: number) => Promise<void>;
  archiveBlog: (id: number) => Promise<void>;
  rejectBlog: (id: number) => Promise<void>;
  flagComment: (id: number, flag: BlogFlagType) => Promise<void>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  deletedBlogs: [],
  isLoading: false,
  error: null,

  fetchBlogs: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await blogService.getAllBlogs(page);
      set({ blogs: response.data, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch blogs";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to fetch blogs");
    }
  },

  fetchDeletedBlogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await blogService.getDeletedBlogs();
      set({ deletedBlogs: response.data, isLoading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch deleted blogs";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to fetch deleted blogs");
    }
  },

  createBlog: async (data: CreateBlogPayload) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("section", data.section);
      if (data.picture) {
        formData.append("picture", data.picture);
      }

      await blogService.createBlog(formData);
      set({ isLoading: false });
      toast.success("Blog created successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to create blog");
      throw error;
    }
  },

  updateBlog: async (id: number, data: CreateBlogPayload) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("category", data.category);
      formData.append("section", data.section);
      if (data.picture) {
        formData.append("picture", data.picture);
      }

      await blogService.updateBlog(id, formData);
      set({ isLoading: false });
      toast.success("Blog updated successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to update blog");
      throw error;
    }
  },

  deleteBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.deleteBlog(id);
      set({ isLoading: false });
      toast.success("Blog deleted successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to delete blog");
      throw error;
    }
  },

  restoreBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.restoreBlog(id);
      set({ isLoading: false });
      toast.success("Blog restored successfully");
      await get().fetchDeletedBlogs();
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to restore blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to restore blog");
      throw error;
    }
  },

  publishBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.publishBlog(id);
      set({ isLoading: false });
      toast.success("Blog published successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to publish blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to publish blog");
      throw error;
    }
  },

  archiveBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.archiveBlog(id);
      set({ isLoading: false });
      toast.success("Blog archived successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to archive blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to archive blog");
      throw error;
    }
  },

  rejectBlog: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.rejectBlog(id);
      set({ isLoading: false });
      toast.success("Blog rejected successfully");
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to reject blog";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to reject blog");
      throw error;
    }
  },

  flagComment: async (id: number, flag: BlogFlagType) => {
    set({ isLoading: true, error: null });
    try {
      await blogService.flagComment(id, { flag });
      set({ isLoading: false });
      toast.success(`Comment flagged as ${flag}`);
      await get().fetchBlogs();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to flag comment";
      set({ error: errorMessage, isLoading: false });
      toast.error("Failed to flag comment");
      throw error;
    }
  },
}));
