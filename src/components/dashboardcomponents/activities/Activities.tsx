import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, AlertCircle, Activity } from "lucide-react";
import { useActivityStore } from "@/stores/use-activity-store";
import { DatePill } from "@/components/ui/date-pill";

// Helper to get icon color based on action type
const getActionColor = (action: string): string => {
    if (action.includes('enabled') || action.includes('verified') || action.includes('Approved')) {
        return 'bg-green-100 text-green-600';
    }
    if (action.includes('disabled') || action.includes('deleted') || action.includes('blocked')) {
        return 'bg-red-100 text-red-600';
    }
    return 'bg-blue-100 text-blue-600';
};

export function Activities() {
    const [searchQuery, setSearchQuery] = useState("");
    const { activities, fetchActivities, searchActivities, isLoading, error } = useActivityStore();

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchActivities(searchQuery);
        } else {
            fetchActivities();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (isLoading && !activities) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !activities) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load activities</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchActivities()} className="bg-green-500 hover:bg-green-600 text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Search and Filter Section */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                />
                <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                </Button>
            </div>

            {/* Activity List */}
            <div className="px-4 sm:px-6 space-y-3 sm:space-y-4 pb-6">
                {(!activities || activities.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Activity className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Admin activities will appear here"}
                        </p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Action Icon */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActionColor(activity.action)}`}>
                                <Activity className="h-5 w-5" />
                            </div>

                            {/* Activity Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{activity.detail}</p>
                                {activity.meta?.staff_id && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Staff: {activity.meta.staff_id}
                                    </p>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className="flex-shrink-0">
                                <DatePill date={activity.created_at} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
