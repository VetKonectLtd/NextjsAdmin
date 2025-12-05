import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function LivestockFarmers() {
    const [searchQuery, setSearchQuery] = useState("");
    const { livestockFarmers, fetchLivestockFarmers, isLoading } = useUserStore();

    useEffect(() => {
        fetchLivestockFarmers();
    }, [fetchLivestockFarmers]);

    if (isLoading && !livestockFarmers) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Search and Filter Section */}
            <div className="px-6 py-6 flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                {/* <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300">
                    <Filter className="h-4 w-4" />
                </Button> */}
            </div>

            {/* User List */}
            <div className="px-6 space-y-4">
                {livestockFarmers?.data
                    .filter((farmer) => {
                        const searchLower = searchQuery.toLowerCase();
                        return (
                            farmer.user.first_name?.toLowerCase().includes(searchLower) ||
                            farmer.user.last_name?.toLowerCase().includes(searchLower) ||
                            farmer.user.email.toLowerCase().includes(searchLower)
                        );
                    })
                    .map((farmer) => (
                    <div
                        key={farmer.id}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {farmer.user.profile?.profile_image_url ? (
                            <img 
                                src={farmer.user.profile.profile_image_url} 
                                alt={farmer.user.first_name || "Farmer"} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {(farmer.user.first_name?.[0] || "") + (farmer.user.last_name?.[0] || "")}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                                {farmer.user.first_name} {farmer.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{farmer.role}</p>
                            <p className="text-xs text-gray-400">{farmer.user.email}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                            <DatePill date={farmer.created_at} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {livestockFarmers?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchLivestockFarmers(livestockFarmers.current_page + 1)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Loading more...
                                <ChevronDown className="h-4 w-4 ml-2 text-green-500" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
