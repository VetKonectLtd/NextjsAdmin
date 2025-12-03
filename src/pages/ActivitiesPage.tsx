import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegion } from "@/components/dashboardcomponents/AfricaRegion";
import { Activities } from "@/components/dashboardcomponents/Activities";
import { cn } from "@/lib/utils";

export function ActivitiesPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("activities");

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section - Without Statistics Cards */}
            <AfricaRegion />

            {/* Main Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                <div className="flex items-center gap-6">
                    {mainNavigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                navigate(tab.path);
                            }}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors",
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

