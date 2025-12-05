import { create } from 'zustand';
import { authService } from '../services/auth-service';
import { formatError } from '../lib/error-utils';
import type { User, LoginCredentials, RegisterCredentials, UpdateProfilePayload } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      // Map 'admin' from response to 'user' in state
      set({ user: response.admin, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: formatError(error), 
        isLoading: false 
      });
      throw error;
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(credentials);
      localStorage.setItem('token', response.token);
      // Assuming register also returns 'admin' or similar, but for now let's assume it returns 'admin' based on AuthResponse type
      set({ user: response.admin, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: formatError(error), 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(data);
      set({ user: response.admin, isLoading: false });
    } catch (error) {
      set({ 
        error: formatError(error), 
        isLoading: false 
      });
      throw error;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
