export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface UserProfile {
  id: number;
  user_id: string;
  profile_image: string | null;
  profile_image_url: string | null;
  cover_page_image_url: string | null;
  bio?: string | null;
}

export interface BaseUser {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_num: string | null;
  state: string | null;
  country: string | null;
  activeRoleName: string | null;
  profile: UserProfile | null;
}

export interface PetOwner {
  id: number;
  user_id: string;
  role: string;
  created_at: string;
  user: BaseUser;
}

export interface Veterinarian {
  id: number;
  user_id: string;
  specialty: string;
  list_them: string;
  address: string;
  longitude: string;
  latitude: string;
  role: string;
  availability: string;
  created_at: string;
  average_rating: number;
  user: BaseUser;
}

export interface Paraprofessional {
  id: number;
  user_id: string;
  name_of_institution: string;
  specialty: string;
  list_them: string;
  contact_num: string;
  address: string;
  longitude: string;
  latitude: string;
  role: string;
  availability: string;
  created_at: string;
  average_rating: number;
  user: BaseUser;
}

export interface Clinic {
  id: number;
  user_id: string;
  name_of_clinic: string;
  specialty: string;
  list_them: string;
  contact_num: string;
  address: string;
  longitude: string;
  latitude: string;
  role: string;
  availability: string;
  created_at: string;
  average_rating: number;
  user: BaseUser;
}

export interface Store {
  id: number;
  user_id: string;
  role: string;
  store_name: string;
  email: string;
  phone_number: string;
  location: string;
  picture: string;
  picture_url: string;
  availability: boolean;
  longitude: string;
  latitude: string;
  disabled: string;
  created_at: string;
  average_rating: number;
}

export interface LivestockFarmer {
  id: number;
  user_id: string;
  role: string;
  created_at: string;
  user: BaseUser;
}

export interface Product {
  id: number;
  user_id: string;
  store_id: string;
  product_id: string;
  product_type: string;
  product_name: string;
  category: string;
  description: string;
  location: string;
  price: string;
  images: string[];
  images_url: string[];
  availability: boolean;
  available_unit: string;
  is_featured: boolean;
  is_verified: boolean;
  disabled: string;
  created_at: string;
  average_rating: number;
  user: BaseUser;
  store: Store;
}

export interface OtherUser {
  id: number;
  user_id: string;
  role: string;
  created_at: string;
  user: BaseUser;
}

// API Response Wrappers
export type PetOwnersResponse = PaginatedResponse<PetOwner>;
export interface VeterinariansResponse { veterinary_doctors: PaginatedResponse<Veterinarian> }
export interface ParaprofessionalsResponse { veterinary_paraprofessionals: PaginatedResponse<Paraprofessional> }
export interface ClinicsResponse { clinics: PaginatedResponse<Clinic> }
export interface StoresResponse { stores: PaginatedResponse<Store> }
export type LivestockFarmersResponse = PaginatedResponse<LivestockFarmer>;
export interface ProductsResponse { products: PaginatedResponse<Product> }
export type OthersResponse = PaginatedResponse<OtherUser>;
