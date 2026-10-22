import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, UserCircle } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";

export function Others() {
    const [searchQuery, setSearchQuery] = useState("");
    const { others, fetchOthers, isLoading, error } = useUserStore();
    const [stackedOthers, setStackedOthers] = useState<any[]>([]);

    useEffect(() => {
        fetchOthers();
    }, [fetchOthers]);

    useEffect(() => {
        if (!others?.data) return;

        setStackedOthers((prev) => {
            // first page replaces list
            if ((others.current_page ?? 1) <= 1) {
                return others.data;
            }

            // next pages append + de-duplicate by id
            const byId = new Map<number, any>(prev.map((u) => [u.id, u]));
            for (const user of others.data) {
                byId.set(user.id, user);
            }
            return Array.from(byId.values());
        });
    }, [others]);

    if (isLoading && !others) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !others) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load users</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchOthers()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    const filteredUsers =
        stackedOthers.filter((user) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                user.user.first_name?.toLowerCase().includes(searchLower) ||
                user.user.last_name?.toLowerCase().includes(searchLower) ||
                user.user.email?.toLowerCase().includes(searchLower)
            );
        }) || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Search and Filter Section */}
            <div className="flex items-center gap-3 px-3 py-4 sm:gap-4 sm:px-6 sm:py-6">
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
            </div>

            {/* User List */}
            <div className="space-y-3 px-3 pb-4 sm:space-y-4 sm:px-6">
                {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <UserCircle className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Users will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="flex flex-col items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4 sm:p-4"
                    >
                        {/* Avatar */}
                        {user.user.profile?.profile_image_url ? (
                            <img 
                                src={user.user.profile.profile_image_url} 
                                alt={user.user.first_name || "User"} 
                                className="h-12 w-12 shrink-0 rounded-full border-2 border-green-500 object-cover"
                            />
                        ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                {(user.user.first_name?.[0] || "") + (user.user.last_name?.[0] || "")}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="min-w-0 flex-1">
                            <h3 className="break-words font-semibold text-gray-900">
                                {user.user.first_name} {user.user.last_name}
                            </h3>
                            <p className="text-sm text-gray-500">{user.role}</p>
                            <p className="break-all text-xs text-gray-400">{user.user.email}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-2 min-[420px]:gap-4">
                            <DatePill date={user.created_at} />
                        </div>
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {others?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchOthers(others.current_page + 1)}
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
