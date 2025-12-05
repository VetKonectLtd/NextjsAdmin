import apiClient from '../lib/api-client';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User, UpdateProfilePayload, ProfileResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v3/admin/login', credentials);
    return response.data;
  },

  // Keeping register for now, though not specified in recent request
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.get('/v3/admin/logout');
    localStorage.removeItem('token');
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/v3/admin/update-details', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ProfileResponse>('/v3/admin/profile');
    return response.data.data; // Unwrap the nested data
  },
};
