import apiClient from "@/lib/api-client";
import type { 
    SubscriptionResponse, 
    CreateSubscriptionPayload, 
    SubscriptionUsersResponse 
} from "@/types/subscription";

export const subscriptionService = {
    // Get all subscription plans
    getAllSubscriptions: async (): Promise<SubscriptionResponse> => {
        const response = await apiClient.get<SubscriptionResponse>('/v3/admin/get-all-subscription');
        return response.data;
    },

    // Create a new subscription plan
    createSubscription: async (data: CreateSubscriptionPayload): Promise<SubscriptionResponse> => {
        const response = await apiClient.post('/v3/admin/subscriptions', data);
        return response.data;
    },

    // Update a subscription plan
    updateSubscription: async (id: number, data: Partial<CreateSubscriptionPayload>): Promise<SubscriptionResponse> => {
        const response = await apiClient.put(`/v3/admin/subscriptions/${id}/update`, data);
        return response.data;
    },

    // Delete a subscription plan
    deleteSubscription: async (id: number): Promise<void> => {
        const response = await apiClient.delete(`/v3/admin/subscriptions/${id}/delete`);
        return response.data;
    },

    // Deactivate a subscription plan
    deactivateSubscription: async (id: number): Promise<void> => {
        const response = await apiClient.put(`/v3/admin/deactivate-subscription/${id}`);
        return response.data;
    },

    // Get users by subscription type
    getUsersBySubscriptionType: async (type: string): Promise<SubscriptionUsersResponse> => {
        // Map UI types to API expected types if necessary, or ensure they match
        // Based on "freemium", "monthly", "quarterly", "yearly" from subscriptionTypes constant
        const response = await apiClient.get<SubscriptionUsersResponse>(`/v3/admin/get-user-by-subscription-type/${type}`);
        return response.data;
    },
    
    // Get subscription approvals (based on API list)
    getSubscriptionApprovals: async (page = 1): Promise<unknown> => {
        const response = await apiClient.get(`/v3/admin/get-subscription-approvals?page=${page}`);
        return response.data;
    }
};
