import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, Loader2, AlertCircle, Stethoscope } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Veterinarians() {
    const [searchQuery, setSearchQuery] = useState("");
    const { veterinarians, fetchVeterinarians, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchVeterinarians();
    }, [fetchVeterinarians]);

    if (isLoading && !veterinarians) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !veterinarians) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load veterinarians</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchVeterinarians()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredVets = veterinarians?.data?.filter((vet) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            vet.user.first_name?.toLowerCase().includes(searchLower) ||
            vet.user.last_name?.toLowerCase().includes(searchLower) ||
            vet.specialty.toLowerCase().includes(searchLower) ||
            vet.address.toLowerCase().includes(searchLower)
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

            {/* Veterinarian List */}
            <div className="px-6 space-y-4">
                {filteredVets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Stethoscope className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No veterinarians found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Veterinarians will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredVets.map((vet) => (
                    <div
                        key={vet.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {vet.user.profile?.profile_image_url ? (
                            <img 
                                src={vet.user.profile.profile_image_url} 
                                alt={vet.user.first_name || "Vet"} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                {(vet.user.first_name?.[0] || "") + (vet.user.last_name?.[0] || "")}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 underline">
                                Dr. {vet.user.first_name} {vet.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{vet.role}</p>
                            <p className="text-xs text-gray-400">{vet.specialty}</p>
                            <p className="text-xs text-gray-400">{vet.list_them}</p>
                            <p className="text-xs text-gray-400">{vet.address}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {vet.availability === "1" ? (
                                <>
                                    <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                        disabled
                                    >
                                        Disable
                                    </Button>
                                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                                        <Check className="h-4 w-4 mr-2" />
                                        Approved
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button 
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() => useUserStore.getState().verifyUser(vet.id, 'doctor')}
                                    >
                                        Verify
                                    </Button>
                                </>
                            )}
                            <DatePill date={vet.created_at} />
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {veterinarians?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchVeterinarians(veterinarians.current_page + 1)}
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
