import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { analyticsService } from "@/services/analytics-service";
import type { CountryAnalyticsData } from "@/types/analytics";
import { toast } from "sonner";

// Icons
import TotalUsersIcon from "@/assets/icons/totalUsersIcon.svg?react";
import AnimalOwnersIcon from "@/assets/icons/animalOwnersIcon.svg?react";
import TotalVeterinariansIcon from "@/assets/icons/totalVeterinariansIcon.svg?react";
import TotalStoresIcon from "@/assets/icons/totalStoresIcon.svg?react";
import TotalClinicsIcon from "@/assets/icons/totalClinicsIcon.svg?react";
import TotalPetsIcons from "@/assets/icons/totalPetsIcons.svg?react";

interface AfricaRegionWithStatsProps {
    statistics: Array<{
        id: string;
        label: string;
        value: string | number;
        icon: React.ComponentType<{ className?: string }>;
        highlighted?: boolean;
    }>;
    isLoading?: boolean;
}

// Common African country flags (using emoji as placeholders - can be replaced with SVG flags)
// Common African country flags
const africanCountries = [
    { name: "Nigeria", flag: "🇳🇬" },
    { name: "Ghana", flag: "🇬🇭" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "Kenya", flag: "🇰🇪" },
    { name: "Egypt", flag: "🇪🇬" },
    { name: "Ethiopia", flag: "🇪🇹" },
    { name: "Tanzania", flag: "🇹🇿" },
    { name: "Uganda", flag: "🇺🇬" },
    { name: "Zimbabwe", flag: "🇿🇼" },
    { name: "Rwanda", flag: "🇷🇼" },
    { name: "Morocco", flag: "🇲🇦" },
    { name: "Senegal", flag: "🇸🇳" },
];

export function AfricaRegionWithStats({ statistics: globalStatistics, isLoading: isGlobalLoading }: AfricaRegionWithStatsProps) {
    const [countrySearch, setCountrySearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [countryStats, setCountryStats] = useState<CountryAnalyticsData | null>(null);
    const [isLoadingCountry, setIsLoadingCountry] = useState(false);

    const filteredCountries = africanCountries.filter(country => 
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    const handleCountrySelect = async (countryName: string) => {
        if (selectedCountry === countryName) {
            // Deselect if already selected
            setSelectedCountry(null);
            setCountryStats(null);
            return;
        }

        setSelectedCountry(countryName);
        setIsLoadingCountry(true);
        setCountryStats(null); // Reset stats while fetching

        try {
            const data = await analyticsService.getCountByCountry(countryName);
            setCountryStats(data);
        } catch (error) {
            console.error("Failed to fetch country stats:", error);
            toast.error(`Failed to load statistics for ${countryName}`);
            setSelectedCountry(null); // Deselect on error
        } finally {
            setIsLoadingCountry(false);
        }
    };

    // Determine which stats to show
    const displayStatistics = selectedCountry ? (countryStats ? [
        {
            id: "total-users",
            label: "Total Users",
            value: countryStats.users,
            icon: TotalUsersIcon,
            highlighted: true,
        },
        {
            id: "animal-owners",
            label: "Animal Owners",
            value: countryStats.pet_owner + countryStats.livestock_farmer,
            icon: AnimalOwnersIcon,
            highlighted: false,
        },
        {
            id: "total-veterinarian",
            label: "Total Veterinarian",
            value: countryStats.veterinaryDoctor + countryStats.veterinaryClinic + countryStats.veterinaryParaprofessional,
            icon: TotalVeterinariansIcon,
            highlighted: false,
        },
        {
            id: "total-stores",
            label: "Total Stores",
            value: countryStats.stores,
            icon: TotalStoresIcon,
            highlighted: false,
        },
        {
            id: "total-clinics",
            label: "Total Clinics",
            value: countryStats.clinics,
            icon: TotalClinicsIcon,
            highlighted: false,
        },
        {
            id: "total-pets-farms",
            label: "Total Pets & Farms",
            value: countryStats.pets + countryStats.farms,
            icon: TotalPetsIcons,
            highlighted: false,
        },
    ] : []) : globalStatistics;

    const isLoading = selectedCountry ? isLoadingCountry : isGlobalLoading;

    // Helper to generate empty loader cards if we are loading country stats and have no data yet
    const loaderCards = Array(6).fill(null).map((_, i) => ({
        id: `loader-${i}`,
        label: "Loading...",
        value: "...",
        icon: TotalUsersIcon, // placeholder
        highlighted: i === 0
    }));

    const statsToShow = (selectedCountry && isLoadingCountry) ? loaderCards : displayStatistics;

    return (
        <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            {/* Title */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Africa</h2>
                {selectedCountry && (
                   <span className="px-2 py-1 bg-green-100 text-green-800 text-xs sm:text-sm font-medium rounded-full">
                       {selectedCountry}
                   </span>
                )}
            </div>

            {/* Country Flags and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Country Flags - scrollable on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide max-w-full sm:max-w-[70%]">
                    {filteredCountries.map((country) => (
                        <button
                            key={country.name}
                            onClick={() => handleCountrySelect(country.name)}
                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xl sm:text-2xl transition-all flex-shrink-0
                                ${selectedCountry === country.name 
                                    ? "border-green-500 scale-110 shadow-md grayscale-0" 
                                    : "border-gray-200 hover:border-green-300 grayscale hover:grayscale-0"
                                }`}
                            title={country.name}
                        >
                            {country.flag}
                        </button>
                    ))}
                    {filteredCountries.length === 0 && (
                        <span className="text-sm text-gray-500 italic">No countries found</span>
                    )}
                </div>

                {/* Country Search Bar */}
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 border border-gray-200 min-w-0">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                    <Input
                        type="text"
                        placeholder="Type in the country of choice"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm sm:text-base min-w-0"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex-shrink-0"
                    >
                        <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                </div>
            </div>

            {/* Statistics Cards - responsive grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {statsToShow.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <StatCard
                            key={stat.id}
                            icon={<Icon className="h-6 w-6 sm:h-8 sm:w-8" />}
                            label={stat.label}
                            value={isLoading ? "..." : stat.value}
                            highlighted={stat.highlighted}
                        />
                    );
                })}
            </div>
        </div>
    );
}
