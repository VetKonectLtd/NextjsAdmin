export interface User {
  id: number;
  staff_id: string;
  permission_level: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  role?: string; // Optional - present in login response but not in profile
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  admin: User;
  token: string;
}

export interface ProfileResponse {
  data: User;
}

export interface LoginCredentials {
  staff_id: string;
  password: string;
}

export interface UpdateProfilePayload {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: string;
  profile_picture?: File | string;
  password?: string;
  password_confirmation?: string;
}

// Keeping RegisterCredentials for now if needed
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
