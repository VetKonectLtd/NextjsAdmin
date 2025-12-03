import { useState, ReactNode } from "react";
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

export function AfricaRegionWithStats({ statistics }: AfricaRegionWithStatsProps) {
    const [countrySearch, setCountrySearch] = useState("");

    return (
        <div className="bg-white px-6 py-6 border-b border-gray-200">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Africa</h2>

            {/* Country Flags and Search */}
            <div className="flex items-center gap-4 mb-6">
                {/* Country Flags */}
                <div className="flex items-center gap-2 flex-wrap">
                    {africanCountries.map((flag, index) => (
                        <button
                            key={index}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl hover:border-green-500 transition-colors grayscale hover:grayscale-0"
                            title="Country flag"
                        >
                            {flag}
                        </button>
                    ))}
                </div>

                {/* Country Search Bar */}
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                    <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                    <Input
                        type="text"
                        placeholder="Type in the country of choice"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-6 gap-4">
                {statistics.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <StatCard
                            key={stat.id}
                            icon={<Icon className="h-8 w-8" />}
                            label={stat.label}
                            value={stat.value}
                            highlighted={stat.highlighted}
                        />
                    );
                })}
            </div>
        </div>
    );
}

