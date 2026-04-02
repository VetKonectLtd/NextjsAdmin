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
import ReactCountryFlag from "react-country-flag";

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
	{ name: "Nigeria", code: "NG" },
	{ name: "Ghana", code: "GH" },
	{ name: "South Africa", code: "ZA" },
	{ name: "Kenya", code: "KE" },
	{ name: "Egypt", code: "EG" },
	{ name: "Ethiopia", code: "ET" },
	{ name: "Tanzania", code: "TZ" },
	{ name: "Uganda", code: "UG" },
	{ name: "Zimbabwe", code: "ZW" },
	{ name: "Rwanda", code: "RW" },
	{ name: "Morocco", code: "MA" },
	{ name: "Senegal", code: "SN" },
];

export function AfricaRegionWithStats({
	statistics: globalStatistics,
	isLoading: isGlobalLoading,
}: AfricaRegionWithStatsProps) {
	const [countrySearch, setCountrySearch] = useState("");
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
	const [countryStats, setCountryStats] = useState<CountryAnalyticsData | null>(
		null,
	);
	const [isLoadingCountry, setIsLoadingCountry] = useState(false);

	const filteredCountries = africanCountries.filter((country) =>
		country.name.toLowerCase().includes(countrySearch.toLowerCase()),
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
	const displayStatistics = selectedCountry
		? countryStats
			? [
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
						value:
							countryStats.veterinaryDoctor +
							countryStats.veterinaryClinic +
							countryStats.veterinaryParaprofessional,
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
			  ]
			: []
		: globalStatistics;

	const isLoading = selectedCountry ? isLoadingCountry : isGlobalLoading;

	// Helper to generate empty loader cards if we are loading country stats and have no data yet
	const loaderCards = Array(6)
		.fill(null)
		.map((_, i) => ({
			id: `loader-${i}`,
			label: "Loading...",
			value: "...",
			icon: TotalUsersIcon, // placeholder
			highlighted: i === 0,
		}));

	const statsToShow =
		selectedCountry && isLoadingCountry ? loaderCards : displayStatistics;

	return (
		<div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-6">
			<div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
				<h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Africa</h2>
				{selectedCountry && (
					<span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 sm:text-sm">
						{selectedCountry}
					</span>
				)}
			</div>

			<div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:gap-4">
				{/* Flags: horizontal scroll on mobile, wrap on larger screens */}
				<div className="max-w-full overflow-x-auto sm:overflow-visible">
					<div className="flex min-w-max items-center gap-2 pb-2 sm:min-w-0 sm:flex-wrap sm:pb-0">
						{filteredCountries.map((country) => (
							<button
								key={country.name}
								onClick={() => handleCountrySelect(country.name)}
								className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-xl transition-all sm:h-10 sm:w-10 sm:text-2xl
                                ${
																	selectedCountry === country.name
																		? "scale-110 border-green-500 shadow-md grayscale-0"
																		: "border-gray-200 grayscale hover:border-green-300 hover:grayscale-0"
																}`}
								title={country.name}
							>
								<ReactCountryFlag
									svg
									countryCode={country.code}
									style={{ width: "1.25em", height: "1.25em" }}
									title={country.name}
								/>
							</button>
						))}
						{filteredCountries.length === 0 && (
							<span className="text-sm italic text-gray-500">
								No countries found
							</span>
						)}
					</div>
				</div>

				<div className="flex w-full items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 sm:px-4">
					<MapPin className="h-4 w-4 flex-shrink-0 text-red-500 sm:h-5 sm:w-5" />
					<Input
						type="text"
						placeholder="Type in the country of choice"
						value={countrySearch}
						onChange={(e) => setCountrySearch(e.target.value)}
						className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 flex-shrink-0 rounded-lg bg-gray-800 text-white hover:bg-gray-700"
					>
						<Search className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* 1-col very small, 2-col mobile, 3-col tablet, 6-col desktop */}
			<div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
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
