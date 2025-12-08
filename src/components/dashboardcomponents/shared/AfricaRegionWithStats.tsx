import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";

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
const africanCountries = [
    "🇬🇭", // Ghana
    "🇿🇦", // South Africa
    "🇳🇬", // Nigeria
    "🇰🇪", // Kenya
    "🇪🇬", // Egypt
    "🇪🇹", // Ethiopia
    "🇹🇿", // Tanzania
    "🇺🇬", // Uganda
    "🇰🇪", // Kenya
    "🇿🇼", // Zimbabwe
    "🇬🇭", // Ghana
    "🇿🇦", // South Africa
];

export function AfricaRegionWithStats({ statistics, isLoading }: AfricaRegionWithStatsProps) {
    const [countrySearch, setCountrySearch] = useState("");

    return (
        <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Africa</h2>

            {/* Country Flags and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* Country Flags - scrollable on mobile */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide">
                    {africanCountries.map((flag, index) => (
                        <button
                            key={index}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl sm:text-2xl hover:border-green-500 transition-colors grayscale hover:grayscale-0 flex-shrink-0"
                            title="Country flag"
                        >
                            {flag}
                        </button>
                    ))}
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
                {statistics.map((stat) => {
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
