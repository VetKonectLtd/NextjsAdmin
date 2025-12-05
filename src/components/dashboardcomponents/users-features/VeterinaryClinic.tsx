import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";

export function VeterinaryClinic() {
    const [searchQuery, setSearchQuery] = useState("");
    const { clinics, fetchClinics, isLoading } = useUserStore();

    useEffect(() => {
        fetchClinics();
    }, [fetchClinics]);

    if (isLoading && !clinics) {
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

            {/* Clinic List */}
            <div className="px-6 space-y-4">
                {clinics?.data.map((clinic) => (
                    <div
                        key={clinic.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {clinic.user.profile?.profile_image_url ? (
                            <img 
                                src={clinic.user.profile.profile_image_url} 
                                alt={clinic.name_of_clinic || "Clinic"} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {(clinic.name_of_clinic?.[0] || "C")}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{clinic.name_of_clinic}</h3>
                            <p className="text-sm text-gray-500">{clinic.specialty}</p>
                            <p className="text-xs text-gray-400">{clinic.contact_num}</p>
                            <p className="text-xs text-gray-400">{clinic.address}</p>
                            <p className="text-xs text-gray-400">{clinic.user.email}</p>
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
                                {new Date(clinic.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {clinics?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchClinics(clinics.current_page + 1)}
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
