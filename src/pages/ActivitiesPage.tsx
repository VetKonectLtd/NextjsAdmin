
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { Activities } from "@/components/dashboardcomponents/activities/Activities";
import { cn } from "@/lib/utils";

export function ActivitiesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("activities");

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section - Without Statistics Cards */}
            <AfricaRegionWithStats statistics={[]} />

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

            {/* Activities Content */}
            <Activities />
        </div>
    );
}

