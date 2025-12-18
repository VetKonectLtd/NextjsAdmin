import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, UserCheck } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Paraprofessionals() {
    const [searchQuery, setSearchQuery] = useState("");
    const { paraprofessionals, fetchParaprofessionals, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchParaprofessionals();
    }, [fetchParaprofessionals]);

    if (isLoading && !paraprofessionals) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !paraprofessionals) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load paraprofessionals</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchParaprofessionals()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredParas = paraprofessionals?.data?.filter((para) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            para.user.first_name?.toLowerCase().includes(searchLower) ||
            para.user.last_name?.toLowerCase().includes(searchLower) ||
            para.specialty.toLowerCase().includes(searchLower) ||
            para.name_of_institution.toLowerCase().includes(searchLower)
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

            {/* List */}
            <div className="px-6 space-y-4">
                {filteredParas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <UserCheck className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No paraprofessionals found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Paraprofessionals will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredParas.map((para) => (
                    <div
                        key={para.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {para.user.profile?.profile_image_url ? (
                            <img 
                                src={para.user.profile.profile_image_url} 
                                alt={para.user.first_name || "Para"} 
                                className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                                {(para.user.first_name?.[0] || "") + (para.user.last_name?.[0] || "")}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 underline">
                                {para.user.first_name} {para.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{para.role}</p>
                            <p className="text-xs text-gray-400">{para.specialty}</p>
                            <p className="text-xs text-gray-400">{para.name_of_institution}</p>
                            <p className="text-xs text-gray-400">{para.contact_num}</p>
                            <p className="text-xs text-gray-400">{para.address}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {para.is_approved === "0" ? (
                                <Button 
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={() => useUserStore.getState().verifyUser(para.id, 'paraprofessional')}
                                >
                                    Verify
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    className="text-green-600 border-green-600 cursor-default hover:bg-transparent hover:text-green-600"
                                >
                                    Verified
                                </Button>
                            )}
                            <DatePill date={para.created_at} />
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {paraprofessionals?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchParaprofessionals(paraprofessionals.current_page + 1)}
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
