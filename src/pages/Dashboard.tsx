import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userCategories } from "@/constants/sidebar";
import { mainNavigationTabs } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { PetOwners } from "@/components/dashboardcomponents/users-features/PetOwners";
import { Veterinarians } from "@/components/dashboardcomponents/users-features/Veterinarians";
import { Paraprofessionals } from "@/components/dashboardcomponents/users-features/Paraprofessionals";
import { Store } from "@/components/dashboardcomponents/users-features/Store";
import { VeterinaryClinic } from "@/components/dashboardcomponents/users-features/VeterinaryClinic";
import { LivestockFarmers } from "@/components/dashboardcomponents/users-features/LivestockFarmers";
import { Others } from "@/components/dashboardcomponents/users-features/Others";
import { Products } from "@/components/dashboardcomponents/users-features/Products";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { useAnalyticsStore } from "@/stores/use-analytics-store";

// Icons
import TotalUsersIcon from "@/assets/icons/totalUsersIcon.svg?react";
import AnimalOwnersIcon from "@/assets/icons/animalOwnersIcon.svg?react";
import TotalVeterinariansIcon from "@/assets/icons/totalVeterinariansIcon.svg?react";
import TotalStoresIcon from "@/assets/icons/totalStoresIcon.svg?react";
import TotalClinicsIcon from "@/assets/icons/totalClinicsIcon.svg?react";
import TotalPetsIcons from "@/assets/icons/totalPetsIcons.svg?react";

export function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeMainTab, setActiveMainTab] = useState("users-features");
    const [activeCategory, setActiveCategory] = useState("pet-owners");
    
    const { data: analyticsData, fetchAnalytics, isLoading } = useAnalyticsStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

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

    // Build statistics from analytics data
    const statistics = [
        {
            id: "total-users",
            label: "Total Users",
            value: analyticsData?.users ?? 0,
            icon: TotalUsersIcon,
            highlighted: true,
        },
        {
            id: "animal-owners",
            label: "Animal Owners",
            value: (analyticsData?.pet_owner ?? 0) + (analyticsData?.livestock_farmer ?? 0),
            icon: AnimalOwnersIcon,
            highlighted: false,
        },
        {
            id: "total-veterinarian",
            label: "Total Veterinarian",
            value: (analyticsData?.veterinaryDoctor ?? 0) + (analyticsData?.veterinaryClinic ?? 0) + (analyticsData?.veterinaryParaprofessional ?? 0),
            icon: TotalVeterinariansIcon,
            highlighted: false,
        },
        {
            id: "total-stores",
            label: "Total Stores",
            value: analyticsData?.stores ?? 0,
            icon: TotalStoresIcon,
            highlighted: false,
        },
        {
            id: "total-clinics",
            label: "Total Clinics",
            value: analyticsData?.clinics ?? 0,
            icon: TotalClinicsIcon,
            highlighted: false,
        },
        {
            id: "total-pets-farms",
            label: "Total Pets & Farms",
            value: (analyticsData?.pets ?? 0) + (analyticsData?.farms ?? 0),
            icon: TotalPetsIcons,
            highlighted: false,
        },
    ];

    const renderContent = () => {
        switch (activeCategory) {
            case "pet-owners":
                return <PetOwners />;
            case "veterinarians":
                return <Veterinarians />;
            case "paraprofessionals":
                return <Paraprofessionals />;
            case "veterinary-clinic":
                return <VeterinaryClinic />;
            case "store":
                return <Store />;
            case "livestock-farmers":
                return <LivestockFarmers />;
            case "products":
                return <Products />;
            case "others":
                return <Others />;
            default:
                return <PetOwners />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Users & Features Statistics */}
            <AfricaRegionWithStats statistics={statistics} isLoading={isLoading} />

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
