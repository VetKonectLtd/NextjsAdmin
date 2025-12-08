import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { Promotion } from "@/components/dashboardcomponents/promotion/Promotion";
import { cn } from "@/lib/utils";
import { usePromotionStore } from "@/stores/use-promotion-store";

// Icons
import TotalPromotionsIcon from "@/assets/icons/totalPromotions.svg?react";
import ActivePromotionsIcon from "@/assets/icons/activePromotions.svg?react";
import RecentPromotionsIcon from "@/assets/icons/recentPromotions.svg?react";
import ExpiredPromotionsIcon from "@/assets/icons/expiredPromotions.svg?react";
import RecentExpiredIcon from "@/assets/icons/recentExpired.svg?react";
import TrialPromotionIcon from "@/assets/icons/trialpromotion.svg?react";

export function PromotionPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("promotion");

    const { promotions, promotionUsers, isLoading, fetchPromotions } = usePromotionStore();

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    // Compute statistics from promotion data
    const statistics = useMemo(() => {
        const totalPlans = promotions.length;
        const activePlans = promotions.filter(p => p.status === 'active').length;
        const totalUsers = promotionUsers.length;
        
        // Count users by status from their promotions
        let activeUsers = 0;
        let expiredUsers = 0;
        
        promotionUsers.forEach(user => {
            user.promotions?.forEach(promo => {
                if (promo.status === 'active') activeUsers++;
                if (promo.status === 'expired') expiredUsers++;
            });
        });

        return [
            {
                id: "total-plans",
                label: "Total Plans",
                value: totalPlans,
                icon: TotalPromotionsIcon,
                highlighted: false,
            },
            {
                id: "active-plans",
                label: "Active Plans",
                value: activePlans,
                icon: ActivePromotionsIcon,
                highlighted: true,
            },
            {
                id: "total-users",
                label: "Promotion Users",
                value: totalUsers,
                icon: RecentPromotionsIcon,
                highlighted: false,
            },
            {
                id: "active-promotions",
                label: "Active Promotions",
                value: activeUsers,
                icon: ExpiredPromotionsIcon,
                highlighted: false,
            },
            {
                id: "expired-promotions",
                label: "Expired Promotions",
                value: expiredUsers,
                icon: RecentExpiredIcon,
                highlighted: false,
            },
            {
                id: "trial-promotion",
                label: "Total Products",
                value: promotionUsers.reduce((sum, u) => sum + (u.promotions?.reduce((pSum, p) => pSum + (p.product ? 1 : 0), 0) || 0), 0),
                icon: TrialPromotionIcon,
                highlighted: false,
            },
        ];
    }, [promotions, promotionUsers]);

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Promotion Statistics */}
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

            {/* Promotion Content */}
            <Promotion />
        </div>
    );
}
