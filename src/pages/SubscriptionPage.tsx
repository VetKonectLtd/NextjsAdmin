import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { Subscription } from "@/components/dashboardcomponents/subscription/Subscription";
import { cn } from "@/lib/utils";
import { useSubscriptionStore } from "@/stores/use-subscription-store";

// Icons
import TotalSubscribersIcon from "@/assets/icons/totalSubscribers.svg?react";
import ActiveSubscriptionIcon from "@/assets/icons/activeSubscription.svg?react";
import RecentSubscriptionIcon from "@/assets/icons/recentSubscription.svg?react";
import ExpiredSubscriptionIcon from "@/assets/icons/expiredSubscription.svg?react";
import RecentExpiredSubIcon from "@/assets/icons/recentExpiredsub.svg?react";
import FreemiumIcon from "@/assets/icons/freemium.svg?react";

export function SubscriptionPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("subscription");

    const { plans, subscribers, isLoading, fetchPlans } = useSubscriptionStore();

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Compute statistics from subscription data
    const statistics = useMemo(() => {
        const totalPlans = plans.length;
        const totalSubscribers = subscribers.length;
        // Count active subscribers (is_active could be boolean or 1/0)
        const activeSubscribers = subscribers.filter(s => s.is_active === true || s.is_active === 1).length;
        const inactiveSubscribers = subscribers.filter(s => s.is_active === false || s.is_active === 0).length;

        return [
            {
                id: "total-subscribers",
                label: "Total Subscribers",
                value: totalSubscribers,
                icon: TotalSubscribersIcon,
                highlighted: false,
            },
            {
                id: "active-subscription",
                label: "Active Users",
                value: activeSubscribers,
                icon: ActiveSubscriptionIcon,
                highlighted: true,
            },
            {
                id: "total-plans",
                label: "Total Plans",
                value: totalPlans,
                icon: RecentSubscriptionIcon,
                highlighted: false,
            },
            {
                id: "inactive-subscription",
                label: "Inactive Users",
                value: inactiveSubscribers,
                icon: ExpiredSubscriptionIcon,
                highlighted: false,
            },
            {
                id: "plan-types",
                label: "Plan Types",
                value: new Set(plans.map(p => p.subscription_code)).size,
                icon: RecentExpiredSubIcon,
                highlighted: false,
            },
            {
                id: "avg-duration",
                label: "Avg Duration (days)",
                value: plans.length > 0 
                    ? Math.round(plans.reduce((sum, p) => sum + (p.date_option === 'Months' ? p.duration * 30 : p.duration), 0) / plans.length)
                    : 0,
                icon: FreemiumIcon,
                highlighted: false,
            },
        ];
    }, [plans, subscribers]);

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Subscription Statistics */}
            <AfricaRegionWithStats statistics={statistics} isLoading={isLoading} />

            {/* Main Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
                <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
                    {mainNavigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                navigate(tab.path);
                            }}
                            className={cn(
                                "px-3 sm:px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                                activeTab === tab.id
                                    ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Subscription Content */}
            <Subscription />
        </div>
    );
}
