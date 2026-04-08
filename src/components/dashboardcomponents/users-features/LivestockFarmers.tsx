import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, Tractor } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function LivestockFarmers() {
    const [searchQuery, setSearchQuery] = useState("");
    const { livestockFarmers, fetchLivestockFarmers, isLoading, error } = useUserStore();
    const [stackedFarmers, setStackedFarmers] = useState<any[]>([]);

    useEffect(() => {
        fetchLivestockFarmers();
    }, [fetchLivestockFarmers]);

    useEffect(() => {
        if (!livestockFarmers?.data) return;

        setStackedFarmers((prev) => {
            // first page replaces list
            if ((livestockFarmers.current_page ?? 1) <= 1) {
                return livestockFarmers.data;
            }

            // next pages append + de-duplicate by id
            const byId = new Map<number, any>(prev.map((f) => [f.id, f]));
            for (const farmer of livestockFarmers.data) {
                byId.set(farmer.id, farmer);
            }
            return Array.from(byId.values());
        });
    }, [livestockFarmers]);

    if (isLoading && !livestockFarmers) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !livestockFarmers) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Failed to load livestock farmers</h3>
                <p className="mb-4 text-sm text-gray-500 break-words">{error}</p>
                <Button onClick={() => fetchLivestockFarmers()} className="bg-green-500 text-white hover:bg-green-600">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredFarmers =
        stackedFarmers.filter((farmer) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                farmer.user.first_name?.toLowerCase().includes(searchLower) ||
                farmer.user.last_name?.toLowerCase().includes(searchLower) ||
                farmer.user.email.toLowerCase().includes(searchLower)
            );
        }) || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Search and Filter Section */}
            <div className="px-4 py-4 sm:px-6 sm:py-6">
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* User List */}
            <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                {filteredFarmers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Tractor className="mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">No livestock farmers found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search query"
                                : "Livestock farmers will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredFarmers.map((farmer) => (
                        <div
                            key={farmer.id}
                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:gap-4"
                        >
                            {/* Top row: avatar + user info */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                {farmer.user.profile?.profile_image_url ? (
                                    <img
                                        src={farmer.user.profile.profile_image_url}
                                        alt={farmer.user.first_name || "Farmer"}
                                        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-green-500 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                        {(farmer.user.first_name?.[0] || "") + (farmer.user.last_name?.[0] || "")}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-gray-900 break-words">
                                        {farmer.user.first_name} {farmer.user.last_name}
                                    </h3>
                                    <p className="text-sm text-gray-500 break-words">{farmer.role}</p>
                                    <p className="text-xs text-gray-400 break-all">{farmer.user.email}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="w-full sm:w-auto">
                                <div className="flex sm:justify-end">
                                    <DatePill date={farmer.created_at} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More Button */}
            {livestockFarmers?.next_page_url && (
                <div className="mt-2 flex justify-center px-4 pb-6 sm:px-6">
                    <Button
                        variant="outline"
                        className="w-full bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100 sm:w-auto"
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
                                <ChevronDown className="ml-2 h-4 w-4 text-green-500" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
