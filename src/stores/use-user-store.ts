import { create } from "zustand";
import { userService } from "../services/user-service";
import { formatError } from "../lib/error-utils";
import type {
  PaginatedResponse,
  PetOwner,
  Veterinarian,
  Paraprofessional,
  Clinic,
  Store,
  LivestockFarmer,
  Product,
  OtherUser,
  Vendor,
} from "../types/users";
import { toast } from "sonner";

interface UserState {
  petOwners: PaginatedResponse<PetOwner> | null;
  veterinarians: PaginatedResponse<Veterinarian> | null;
  paraprofessionals: PaginatedResponse<Paraprofessional> | null;
  clinics: PaginatedResponse<Clinic> | null;
  stores: PaginatedResponse<Store> | null;
  livestockFarmers: PaginatedResponse<LivestockFarmer> | null;
  products: PaginatedResponse<Product> | null;
  others: PaginatedResponse<OtherUser> | null;
  vendors: PaginatedResponse<Vendor> | null;

  isLoading: boolean;
  error: string | null;

  fetchPetOwners: (page?: number) => Promise<void>;
  fetchVeterinarians: (page?: number) => Promise<void>;
  fetchParaprofessionals: (page?: number) => Promise<void>;
  fetchClinics: (page?: number) => Promise<void>;
  fetchStores: (page?: number) => Promise<void>;
  fetchLivestockFarmers: (page?: number) => Promise<void>;
  fetchProducts: (page?: number) => Promise<void>;
  fetchOthers: (page?: number) => Promise<void>;
  fetchVendors: (page?: number) => Promise<void>;

  verifyUser: (
    id: number,
    type: "clinic" | "veterinary-clinic" | "doctor" | "paraprofessional"
  ) => Promise<void>;
  toggleUserStatus: (
    id: number,
    type: "store" | "case" | "clinic" | "farm" | "product" | "pet",
    action: "enable" | "disable"
  ) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  petOwners: null,
  veterinarians: null,
  paraprofessionals: null,
  clinics: null,
  stores: null,
  livestockFarmers: null,
  products: null,
  others: null,
  vendors: null,

  isLoading: false,
  error: null,

  fetchPetOwners: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getPetOwners(page);
      set({ petOwners: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchVeterinarians: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getVeterinarians(page);
      set({ veterinarians: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchParaprofessionals: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getParaprofessionals(page);
      set({ paraprofessionals: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchClinics: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getClinics(page);
      set({ clinics: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchStores: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getStores(page);
      set({ stores: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchLivestockFarmers: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getLivestockFarmers(page);
      set({ livestockFarmers: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchProducts: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getProducts(page);
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchOthers: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getOthers(page);
      set({ others: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  fetchVendors: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await userService.getVendors(page);
      set({ vendors: data, isLoading: false });
    } catch (error) {
      set({ error: formatError(error), isLoading: false });
    }
  },

  verifyUser: async (id, type) => {
    try {
      await userService.verifyEntity(id, type);
      // Refresh the relevant list based on type
      const state = get();
      if (type === "doctor")
        state.fetchVeterinarians(state.veterinarians?.current_page);
      if (type === "paraprofessional")
        state.fetchParaprofessionals(state.paraprofessionals?.current_page);
      if (type === "clinic" || type === "veterinary-clinic")
        state.fetchClinics(state.clinics?.current_page);

      toast.success("User verified successfully");
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },

  toggleUserStatus: async (id, type, action) => {
    try {
      await userService.toggleStatus(id, type, action);
      // Refresh the relevant list based on type
      const state = get();
      if (type === "store") state.fetchStores(state.stores?.current_page);
      if (type === "clinic") state.fetchClinics(state.clinics?.current_page);
      if (type === "farm")
        state.fetchLivestockFarmers(state.livestockFarmers?.current_page);
      if (type === "product") state.fetchProducts(state.products?.current_page);
      if (type === "pet") state.fetchPetOwners(state.petOwners?.current_page);

      toast.success(`User ${action}d successfully`);
    } catch (error) {
      const errorMessage = formatError(error);
      set({ error: errorMessage });
      toast.error(errorMessage);
    }
  },
}));
