import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";

export function PetOwners() {
    const [searchQuery, setSearchQuery] = useState("");
    const { petOwners, fetchPetOwners, isLoading } = useUserStore();

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
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* User List */}
            <div className="px-6 space-y-4">
                {petOwners?.data.map((owner) => (
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
                            <Button
                                variant="destructive"
                                className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                            >
                                Disable
                            </Button>
                            <span className="text-xs text-gray-400">
                                {new Date(owner.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
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
