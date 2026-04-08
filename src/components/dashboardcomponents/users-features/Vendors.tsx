import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, ShoppingBag, ChevronDown } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Vendors() {
    const [searchQuery, setSearchQuery] = useState("");
    const { vendors, fetchVendors, isLoading, error } = useUserStore();
    const [stackedVendors, setStackedVendors] = useState<any[]>([]);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    useEffect(() => {
        if (!vendors?.data) return;

        setStackedVendors((prev) => {
            // first page replaces list
            if ((vendors.current_page ?? 1) <= 1) {
                return vendors.data;
            }

            // next pages append + de-duplicate by id
            const byId = new Map<number, any>(prev.map((v) => [v.id, v]));
            for (const vendor of vendors.data) {
                byId.set(vendor.id, vendor);
            }
            return Array.from(byId.values());
        });
    }, [vendors]);

    if (isLoading && !vendors) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !vendors) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Failed to load vendors</h3>
                <p className="mb-4 break-words text-sm text-gray-500">{error}</p>
                <Button onClick={() => fetchVendors()} className="bg-green-500 text-white hover:bg-green-600">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredVendors =
        stackedVendors.filter((vendor) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                vendor.user.first_name?.toLowerCase().includes(searchLower) ||
                vendor.user.last_name?.toLowerCase().includes(searchLower) ||
                vendor.role.toLowerCase().includes(searchLower)
            );
        }) || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Search */}
            <div className="px-4 py-4 sm:px-6 sm:py-6">
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Vendor List */}
            <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                {filteredVendors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <ShoppingBag className="mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">No vendors found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Vendors will appear here once registered"}
                        </p>
                    </div>
                ) : (
                    filteredVendors.map((vendor) => (
                        <div
                            key={vendor.id}
                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
                        >
                            {/* Avatar + Info */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                {vendor.user.profile?.profile_image_url ? (
                                    <img
                                        src={vendor.user.profile.profile_image_url}
                                        alt={vendor.user.first_name || "Vendor"}
                                        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-green-500 object-cover sm:h-16 sm:w-16"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white sm:h-16 sm:w-16 sm:text-lg">
                                        {(vendor.user.first_name?.[0] || "") + (vendor.user.last_name?.[0] || "")}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words font-semibold text-gray-900 underline">
                                        {vendor.user.first_name} {vendor.user.last_name}
                                    </h3>
                                    <p className="break-words text-sm text-gray-500">{vendor.role}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="w-full sm:w-auto">
                                <div className="flex sm:justify-end">
                                    <DatePill date={vendor.created_at} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More */}
            {vendors?.next_page_url && (
                <div className="mt-2 flex justify-center px-4 pb-6 sm:px-6">
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 sm:w-auto"
                        onClick={() => fetchVendors(vendors.current_page + 1)}
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
