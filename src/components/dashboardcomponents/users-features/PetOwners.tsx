import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, Users } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function PetOwners() {
    const [searchQuery, setSearchQuery] = useState("");
    const { petOwners, fetchPetOwners, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchPetOwners();
    }, [fetchPetOwners]);

    if (isLoading && !petOwners) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !petOwners) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load pet owners</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchPetOwners()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredOwners = petOwners?.data?.filter((owner) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            owner.user.first_name?.toLowerCase().includes(searchLower) ||
            owner.user.last_name?.toLowerCase().includes(searchLower) ||
            owner.user.email.toLowerCase().includes(searchLower)
        );
    }) || [];

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
            </div>

            {/* User List */}
            <div className="px-6 space-y-4">
                {filteredOwners.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No pet owners found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Pet owners will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredOwners.map((owner) => (
                    <div
                        key={owner.id}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {owner.user.profile?.profile_image_url ? (
                            <img 
                                src={owner.user.profile.profile_image_url} 
                                alt={owner.user.first_name || "User"} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {(owner.user.first_name?.[0] || "") + (owner.user.last_name?.[0] || "")}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                                {owner.user.first_name} {owner.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{owner.role}</p>
                            <p className="text-xs text-gray-400">{owner.user.email}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                            <DatePill date={owner.created_at} />
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {petOwners?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchPetOwners(petOwners.current_page + 1)}
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
