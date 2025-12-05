import apiClient from '../lib/api-client';
import type {
  PetOwnersResponse,
  VeterinariansResponse,
  ParaprofessionalsResponse,
  ClinicsResponse,
  StoresResponse,
  LivestockFarmersResponse,
  ProductsResponse,
  OthersResponse,
} from '../types/users';

export const userService = {
  getPetOwners: async (page = 1) => {
    const response = await apiClient.get<PetOwnersResponse>(`/v3/admin/get-pet-owner?page=${page}`);
    return response.data;
  },

  getVeterinarians: async (page = 1) => {
    const response = await apiClient.get<VeterinariansResponse>(`/v3/admin/get-all-veterinary-doctor?page=${page}`);
    return response.data.veterinary_doctors;
  },

  getParaprofessionals: async (page = 1) => {
    const response = await apiClient.get<ParaprofessionalsResponse>(`/v3/admin/get-all-veterinary-paraprofessional?page=${page}`);
    return response.data.veterinary_paraprofessionals;
  },

  getClinics: async (page = 1) => {
    const response = await apiClient.get<ClinicsResponse>(`/v3/admin/get-all-veterinary-clinic?page=${page}`);
    return response.data.clinics;
  },

  getStores: async (page = 1) => {
    const response = await apiClient.get<StoresResponse>(`/v3/admin/get-stores?page=${page}`);
    return response.data.stores;
  },

  getLivestockFarmers: async (page = 1) => {
    const response = await apiClient.get<LivestockFarmersResponse>(`/v3/admin/get-livestock-farmer?page=${page}`);
    return response.data;
  },

  getProducts: async (page = 1) => {
    const response = await apiClient.get<ProductsResponse>(`/v3/admin/get-products?page=${page}`);
    return response.data.products;
  },

  getOthers: async (page = 1) => {
    const response = await apiClient.get<OthersResponse>(`/v3/admin/get-other?page=${page}`);
    return response.data;
  },
};
