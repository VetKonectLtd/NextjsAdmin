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
    const formData = new FormData();
    
    if (data.email) formData.append('email', data.email);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.phone_number) formData.append('phone_number', data.phone_number);
    if (data.location) formData.append('location', data.location);
    if (data.profile_picture) formData.append('profile_picture', data.profile_picture);
    if (data.password) formData.append('password', data.password);
    if (data.password_confirmation) formData.append('password_confirmation', data.password_confirmation);

    const response = await apiClient.post<AuthResponse>('/v3/admin/update-details', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ProfileResponse>('/v3/admin/profile');
    return response.data.data; // Unwrap the nested data
  },
};
