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
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !stores) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Failed to load stores</h3>
                <p className="mb-4 break-words text-sm text-gray-500">{error}</p>
                <Button onClick={() => fetchStores()} className="bg-green-500 text-white hover:bg-green-600">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredStores =
        stores?.data?.filter((store) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                store.store_name.toLowerCase().includes(searchLower) ||
                store.location.toLowerCase().includes(searchLower)
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

            {/* Store List */}
            <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                {filteredStores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <StoreIcon className="mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">No stores found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search query"
                                : "Stores will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredStores.map((store) => (
                        <div
                            key={store.id}
                            className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
                        >
                            {/* Avatar + info */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                {store.picture_url ? (
                                    <img
                                        src={store.picture_url}
                                        alt={store.store_name}
                                        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-green-500 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                        {store.store_name?.[0] || "S"}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words font-semibold text-gray-900">{store.store_name}</h3>
                                    <p className="break-words text-sm text-gray-500">{store.location}</p>
                                    <p className="break-all text-xs text-gray-400">{store.phone_number}</p>
                                    <p className="break-all text-xs text-gray-400">{store.email}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="w-full sm:w-auto">
                                <div className="flex sm:justify-end">
                                    <DatePill date={store.created_at} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More */}
            {stores?.next_page_url && (
                <div className="mt-2 flex justify-center px-4 pb-6 sm:px-6">
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 sm:w-auto"
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
                                <ChevronDown className="ml-2 h-4 w-4 text-green-500" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
