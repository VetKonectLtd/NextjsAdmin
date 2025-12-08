import { create } from 'zustand';
import { promotionService } from '@/services/promotion-service';
import type { PromotionPlan, CreatePromotionPayload } from '@/types/promotion';
import { toast } from 'sonner';

interface PromotionState {
    // State
    promotions: PromotionPlan[];
    promotionUsers: import("@/types/promotion").PromotionUserData[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    fetchPromotions: (page?: number) => Promise<void>;
    createPromotion: (data: CreatePromotionPayload) => Promise<void>;
    updatePromotion: (id: number, data: Partial<CreatePromotionPayload>) => Promise<void>;
    deletePromotion: (id: number) => Promise<void>;
    
    // New Actions
    fetchPromotionUsers: (title: string) => Promise<void>;
    togglePromotionStatus: (userId: number, role: string, currentStatus: string, title: string) => Promise<void>;
    expireUserPromotion: (id: number, title: string) => Promise<void>;
}

export const usePromotionStore = create<PromotionState>((set, get) => ({
    promotions: [],
    isLoading: false,
    error: null,

    fetchPromotions: async (page = 1) => {
        set({ isLoading: true, error: null });
        try {
            const response = await promotionService.getPromotions(page);
            if (response && response.plans && Array.isArray(response.plans.data)) {
                set({ promotions: response.plans.data, isLoading: false });
            } else {
                set({ promotions: [], isLoading: false });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch promotions';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to fetch promotions");
        }
    },

    createPromotion: async (data: CreatePromotionPayload) => {
        set({ isLoading: true, error: null });
        try {
            await promotionService.createPromotion(data);
            set({ isLoading: false });
            toast.success("Promotion plan created successfully");
            // Refresh list
            // Refresh list
            await get().fetchPromotions();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create promotion';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to create promotion plan");
            throw error;
        }
    },

    updatePromotion: async (id: number, data: Partial<CreatePromotionPayload>) => {
        set({ isLoading: true, error: null });
        try {
            await promotionService.updatePromotion(id, data);
            set({ isLoading: false });
            toast.success("Promotion plan updated successfully");
            // Refresh list
            await get().fetchPromotions();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update promotion';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to update promotion plan");
            throw error;
        }
    },

    deletePromotion: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await promotionService.deletePromotion(id);
            set({ isLoading: false });
            toast.success("Promotion plan deleted successfully");
            // Refresh list
            // Refresh list
            await get().fetchPromotions();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete promotion';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to delete promotion plan");
            throw error;
        }
    },

    // New actions for User Management
    promotionUsers: [],
    
    fetchPromotionUsers: async (title: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await promotionService.getPromotionUsers(title);
            if (response && response.data) {
                set({ promotionUsers: response.data, isLoading: false });
            } else {
                set({ promotionUsers: [], isLoading: false });
            }
        } catch (error: unknown) {
            console.error("Fetch users error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch promotion users';
            set({ error: errorMessage, isLoading: false, promotionUsers: [] });
            toast.error("Failed to fetch users for this plan");
        }
    },

    togglePromotionStatus: async (userId: number, role: string, currentStatus: string, title: string) => {
        // Optimistic update could be tricky with nested data, so we'll just wait for API
        set({ isLoading: true });
        try {
            if (currentStatus === 'active') {
                await promotionService.deactivatePromotion(userId, role);
                toast.success("Promotion deactivated successfully");
            } else {
                await promotionService.activatePromotion(userId, role);
                toast.success("Promotion activated successfully");
            }
            // Refresh users list
            await get().fetchPromotionUsers(title);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to update promotion status");
        }
    },

    expireUserPromotion: async (id: number, title: string) => {
        set({ isLoading: true });
        try {
            await promotionService.expireUserPromotion(id);
            toast.success("Promotion expired successfully");
            // Refresh users list
            await get().fetchPromotionUsers(title);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to expire promotion';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to expire promotion");
        }
    }
}));
