import apiClient from "@/lib/api-client";
import type { 
    PromotionResponse, 
    CreatePromotionPayload 
} from "@/types/promotion";

export const promotionService = {
    // Get all promotion plans
    getPromotions: async (page = 1): Promise<PromotionResponse> => {
        const response = await apiClient.get<PromotionResponse>(`/v3/admin/promotion-plans?page=${page}`);
        return response.data;
    },

    // Create a new promotion plan
    createPromotion: async (data: CreatePromotionPayload): Promise<PromotionResponse> => {
        const response = await apiClient.post('/v3/admin/promotion-plans', data);
        return response.data;
    },

    // Update a promotion plan
    updatePromotion: async (id: number, data: Partial<CreatePromotionPayload>): Promise<PromotionResponse> => {
        const response = await apiClient.put(`/v3/admin/promotion-plans/${id}`, data);
        return response.data;
    },

    // Delete a promotion plan
    deletePromotion: async (id: number): Promise<void> => {
        const response = await apiClient.delete(`/v3/admin/promotion-plans/${id}`);
        return response.data;
    },

    // Get users by promotion title
    getPromotionUsers: async (title: string): Promise<import("@/types/promotion").PromotionUsersResponse> => {
        const response = await apiClient.get<import("@/types/promotion").PromotionUsersResponse>(`/v3/admin/promotion-users/${title}`);
        return response.data;
    },

    // Activate a user's promotion
    activatePromotion: async (userId: number, role: string): Promise<void> => {
        await apiClient.post('/v3/admin/ads-promotions/activate', { user_id: userId, role });
    },

    // Deactivate a user's promotion
    deactivatePromotion: async (userId: number, role: string): Promise<void> => {
        await apiClient.post('/v3/admin/ads-promotions/deactivate', { user_id: userId, role });
    },

    // Expire a user's promotion
    expireUserPromotion: async (id: number): Promise<void> => {
        await apiClient.get(`/v3/admin/user-promotions/${id}/expire`);
    }
};
