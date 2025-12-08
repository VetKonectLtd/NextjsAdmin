import { create } from 'zustand';
import { subscriptionService } from '@/services/subscription-service';
import type { SubscriptionPlan, SubscriptionUser, CreateSubscriptionPayload } from '@/types/subscription';
import { toast } from 'sonner';

interface SubscriptionState {
    plans: SubscriptionPlan[];
    subscribers: SubscriptionUser[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    fetchPlans: () => Promise<void>;
    fetchSubscribersByType: (type: string) => Promise<void>;
    createPlan: (data: CreateSubscriptionPayload) => Promise<void>;
    updatePlan: (id: number, data: Partial<CreateSubscriptionPayload>) => Promise<void>;
    deletePlan: (id: number) => Promise<void>;
    deactivatePlan: (id: number) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    plans: [],
    subscribers: [],
    isLoading: false,
    error: null,

    fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await subscriptionService.getAllSubscriptions();
            // Verify structure matches expected response
            if (response && response.subscriptions && Array.isArray(response.subscriptions.data)) {
                set({ plans: response.subscriptions.data, isLoading: false });
            } else {
                 set({ plans: [], isLoading: false });
                 console.error("Unexpected subscription plans response structure", response);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscription plans';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to fetch subscription plans");
        }
    },

    fetchSubscribersByType: async (type: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await subscriptionService.getUsersBySubscriptionType(type);
            if (response && Array.isArray(response.users)) {
                set({ subscribers: response.users, isLoading: false });
            } else {
                set({ subscribers: [], isLoading: false });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subscribers';
            set({ error: errorMessage, isLoading: false });
            // Don't toast on initial load errors to avoid spamming if multiple fail, or handle gracefully
            console.error("Failed to fetch subscribers for type", type, error);
        }
    },

    createPlan: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.createSubscription(data);
            set({ isLoading: false });
            toast.success("Subscription plan created successfully");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create plan';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to create subscription plan");
            throw error;
        }
    },

    updatePlan: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.updateSubscription(id, data);
            set({ isLoading: false });
            toast.success("Subscription plan updated successfully");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update plan';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to update subscription plan");
            throw error;
        }
    },

    deletePlan: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.deleteSubscription(id);
            set({ isLoading: false });
            toast.success("Subscription plan deleted successfully");
            // Optimistically update or refetch needed?
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete plan';
            set({ error: errorMessage, isLoading: false });
            toast.error("Failed to delete subscription plan");
            throw error;
        }
    },

    deactivatePlan: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await subscriptionService.deactivateSubscription(id);
            set({ isLoading: false });
            toast.success("Subscription plan deactivated successfully");
        } catch (error: unknown) {
             const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate plan';
             set({ error: errorMessage, isLoading: false });
             toast.error("Failed to deactivate subscription plan");
             throw error;
        }
    }
}));
