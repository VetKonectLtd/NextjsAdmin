import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Paraprofessionals() {
    const [searchQuery, setSearchQuery] = useState("");
    const { paraprofessionals, fetchParaprofessionals, isLoading } = useUserStore();

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

            {/* List */}
            <div className="px-6 space-y-4">
                {paraprofessionals?.data
                    .filter((para) => {
                        const searchLower = searchQuery.toLowerCase();
                        return (
                            para.user.first_name?.toLowerCase().includes(searchLower) ||
                            para.user.last_name?.toLowerCase().includes(searchLower) ||
                            para.specialty.toLowerCase().includes(searchLower) ||
                            para.name_of_institution.toLowerCase().includes(searchLower)
                        );
                    })
                    .map((para) => (
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
                            {para.availability === "1" ? (
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
                                        onClick={() => useUserStore.getState().verifyUser(para.id, 'paraprofessional')}
                                    >
                                        Verify
                                    </Button>
                                    {/* <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                    >
                                        Reject
                                    </Button> */}
                                </>
                            )}
                            <DatePill date={para.created_at} />
                        </div>
                    </div>
                ))}
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
