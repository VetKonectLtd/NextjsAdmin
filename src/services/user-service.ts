import apiClient from "../lib/api-client";
import type {
  PetOwnersResponse,
  VeterinariansResponse,
  ParaprofessionalsResponse,
  ClinicsResponse,
  StoresResponse,
  LivestockFarmersResponse,
  ProductsResponse,
  OthersResponse,
  VendorsResponse,
} from "../types/users";

export const userService = {
  getPetOwners: async (page = 1) => {
    const response = await apiClient.get<PetOwnersResponse>(
      `/v3/admin/get-pet-owner?page=${page}`
    );
    return response.data;
  },

  getVendors: async (page = 1) => {
    const response = await apiClient.get<VendorsResponse>(
      `/v3/admin/get-vendor?page=${page}`
    );
    return response.data;
  },

  getVeterinarians: async (page = 1) => {
    const response = await apiClient.get<VeterinariansResponse>(
      `/v3/admin/get-all-veterinary-doctor?page=${page}`
    );
    return response.data.veterinary_doctors;
  },

  getParaprofessionals: async (page = 1) => {
    const response = await apiClient.get<ParaprofessionalsResponse>(
      `/v3/admin/get-all-veterinary-paraprofessional?page=${page}`
    );
    return response.data.veterinary_paraprofessionals;
  },

  getClinics: async (page = 1) => {
    const response = await apiClient.get<ClinicsResponse>(
      `/v3/admin/get-all-veterinary-clinic?page=${page}`
    );
    return response.data.clinics;
  },

  getStores: async (page = 1) => {
    const response = await apiClient.get<StoresResponse>(
      `/v3/admin/get-stores?page=${page}`
    );
    return response.data.stores;
  },

  getLivestockFarmers: async (page = 1) => {
    const response = await apiClient.get<LivestockFarmersResponse>(
      `/v3/admin/get-livestock-farmer?page=${page}`
    );
    return response.data;
  },

  getProducts: async (page = 1) => {
    const response = await apiClient.get<ProductsResponse>(
      `/v3/admin/get-products?page=${page}`
    );
    return response.data.products;
  },

  getOthers: async (page = 1) => {
    const response = await apiClient.get<OthersResponse>(
      `/v3/admin/get-other?page=${page}`
    );
    return response.data;
  },

  // Actions
  verifyEntity: async (
    id: number,
    type: "clinic" | "veterinary-clinic" | "doctor" | "paraprofessional"
  ) => {
    // Map generic type to specific endpoint part if needed, but here they seem to follow a pattern
    // verify-clinic/{id}/clinic
    // verify-veterinary-clinic/{id}/clinic
    // verify-veterinary-doctor/{id}/doctor
    // verify-veterinary-paraprofessional/{id}/paraprofessional

    let endpoint = "";
    let suffix = "";

    switch (type) {
      case "clinic":
        endpoint = "verify-clinic";
        suffix = "clinic";
        break;
      case "veterinary-clinic":
        endpoint = "verify-veterinary-clinic";
        suffix = "clinic";
        break;
      case "doctor":
        endpoint = "verify-veterinary-doctor";
        suffix = "doctor";
        break;
      case "paraprofessional":
        endpoint = "verify-veterinary-paraprofessional";
        suffix = "paraprofessional";
        break;
    }

    const response = await apiClient.patch(
      `/v3/admin/${endpoint}/${id}/${suffix}`
    );
    return response.data;
  },

  toggleStatus: async (
    id: number,
    type: "store" | "case" | "clinic" | "farm" | "product" | "pet",
    action: "enable" | "disable"
  ) => {
    const response = await apiClient.patch(`/v3/admin/${action}/${id}/${type}`);
    return response.data;
  },
};
