import apiClient from "@/lib/api-client";

export interface UpdateProfileData {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  location?: string;
  profile_picture?: File;
  password?: string;
  password_confirmation?: string;
}

export interface AdminProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  profile_image_url?: string;
}

export const accountService = {
  updateProfile: async (data: UpdateProfileData) => {
    const formData = new FormData();
    
    if (data.email) formData.append('email', data.email);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.phone_number) formData.append('phone_number', data.phone_number);
    if (data.location) formData.append('location', data.location);
    if (data.profile_picture) formData.append('profile_picture', data.profile_picture);
    if (data.password) formData.append('password', data.password);
    if (data.password_confirmation) formData.append('password_confirmation', data.password_confirmation);

    const response = await apiClient.post('/v3/admin/update-details', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.get('/v3/admin/logout');
    return response.data;
  },
};
