import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, Store as StoreIcon } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Store() {
    const [searchQuery, setSearchQuery] = useState("");
    const { stores, fetchStores, isLoading, error } = useUserStore();

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    if (isLoading && !stores) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !stores) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load stores</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchStores()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredStores = stores?.data?.filter((store) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            store.store_name.toLowerCase().includes(searchLower) ||
            store.location.toLowerCase().includes(searchLower)
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

            {/* Store List */}
            <div className="px-6 space-y-4">
                {filteredStores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <StoreIcon className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No stores found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Stores will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredStores.map((store) => (
                    <div
                        key={store.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        {store.picture_url ? (
                            <img 
                                src={store.picture_url} 
                                alt={store.store_name} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                {store.store_name?.[0] || "S"}
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{store.store_name}</h3>
                            <p className="text-sm text-gray-500">{store.location}</p>
                            <p className="text-xs text-gray-400">{store.phone_number}</p>
                            <p className="text-xs text-gray-400">{store.email}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                            <DatePill date={store.created_at} />
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {stores?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchStores(stores.current_page + 1)}
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
