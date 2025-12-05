import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";

const mockActivities = [
    {
        id: 1,
        title: "Deleted Store",
        description: "Store Name Owned By User's Name",
        timestamp: "5 mins ago",
    },
    {
        id: 2,
        title: "Deleted Clinic",
        description: "Store Name Owned By User's Name",
        timestamp: "15 mins ago",
    },
    {
        id: 3,
        title: "Liked a Forum Chat",
        description: "Topic By Author's Name",
        timestamp: "Today 12:42 PM CST",
    },
    {
        id: 4,
        title: "Block Account",
        description: "User's Name",
        timestamp: "Yesterday 12:42 PM CST",
    },
    {
        id: 5,
        title: "Sent a Direct Message",
        description: "Receiver's Name",
        timestamp: "Mon 27, March 2023 12:42 PM CST",
    },
];

export function Activities() {
    const [searchQuery, setSearchQuery] = useState("");

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

            {/* Activity List */}
            <div className="px-6 space-y-4 pb-6">
                {mockActivities.map((activity) => (
                    <div
                        key={activity.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Activity Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-400">{activity.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            <div className="mt-6 flex justify-center pb-6">
                <Button
                    variant="outline"
                    className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                    Loading more...
                    <ChevronDown className="h-4 w-4 ml-2 text-green-500" />
                </Button>
            </div>
        </div>
    );
}

