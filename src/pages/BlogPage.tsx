import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { usersFeaturesStatistics } from "@/constants/users-features";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/AfricaRegionWithStats";
import { Blog } from "@/components/dashboardcomponents/Blog";
import { cn } from "@/lib/utils";

export function BlogPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("blog");

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Blog Statistics */}
            <AfricaRegionWithStats statistics={usersFeaturesStatistics} />

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

            {/* Blog Content */}
            <Blog />
        </div>
    );
}

