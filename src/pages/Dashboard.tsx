import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userCategories } from "@/constants/sidebar";
import { mainNavigationTabs } from "@/constants/navigation";
import { usersFeaturesStatistics } from "@/constants/users-features";
import { cn } from "@/lib/utils";
import { AnimalOwners } from "@/components/dashboardcomponents/AnimalOwners";
import { Veterinarians } from "@/components/dashboardcomponents/Veterinarians";
import { Store } from "@/components/dashboardcomponents/Store";
import { Clinic } from "@/components/dashboardcomponents/Clinic";
import { PetsAndFarms } from "@/components/dashboardcomponents/PetsAndFarms";
import { Products } from "@/components/dashboardcomponents/Products";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/AfricaRegionWithStats";

export function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeMainTab, setActiveMainTab] = useState("users-features");
    const [activeCategory, setActiveCategory] = useState("animal-owners");

    useEffect(() => {
        // Handle navigation based on path
        if (location.pathname === "/content") {
            navigate("/content");
            return;
        }

        // Set active tab based on path
        const tab = mainNavigationTabs.find((t) => location.pathname === t.path);
        if (tab) {
            setActiveMainTab(tab.id);
        }
    }, [location.pathname, navigate]);

    const renderContent = () => {
        switch (activeCategory) {
            case "animal-owners":
                return <AnimalOwners />;
            case "veterinarians":
                return <Veterinarians />;
            case "store":
                return <Store />;
            case "clinic":
                return <Clinic />;
            case "pets-farms":
                return <PetsAndFarms />;
            case "products":
                return <Products />;
            default:
                return <AnimalOwners />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Users & Features Statistics */}
            <AfricaRegionWithStats statistics={usersFeaturesStatistics} />

            {/* Main Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-6">
                    {mainNavigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveMainTab(tab.id);
                                navigate(tab.path);
                            }}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors",
                                activeMainTab === tab.id
                                    ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Sub Navigation - Only show for Users & Features */}
            {activeMainTab === "users-features" && (
                <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        {userCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors",
                                    activeCategory === category.id
                                        ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>
                </nav>
            )}

            {/* Main Content - Only show Users & Features content */}
            {activeMainTab === "users-features" && renderContent()}
        </div>
    );
}

