import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockContent = [
    {
        id: 1,
        title: "Content Title",
        timeAgo: "10 mins ago",
        author: "Author Name",
        status: "pending",
        lastActive: "15 mins ago",
    },
    {
        id: 2,
        title: "Content Title",
        timeAgo: "10 mins ago",
        author: "Author Name",
        status: "pending",
        lastActive: "15 mins ago",
    },
    {
        id: 3,
        title: "Content Title",
        timeAgo: "10 mins ago",
        author: "Author Name",
        status: "approved",
        lastActive: "15 mins ago",
    },
    {
        id: 4,
        title: "Content Title",
        timeAgo: "15 mins ago",
        author: "Author Name",
        status: "rejected",
        lastActive: "20 mins ago",
    },
    {
        id: 5,
        title: "Content Title",
        timeAgo: "Today 12:42 PM CST",
        author: "Author Name",
        status: "approved",
        lastActive: "Today 12:42 PM CST",
    },
];

export function Content() {
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

            {/* Content List */}
            <div className="px-6 space-y-4 pb-6">
                {mockContent.map((content) => (
                    <div
                        key={content.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Content Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                            <p className="text-sm text-gray-500">
                                {content.timeAgo} - By {content.author}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {content.status === "pending" && (
                                <>
                                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                                        Approve
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                    >
                                        Reject
                                    </Button>
                                </>
                            )}
                            {content.status === "approved" && (
                                <>
                                    <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                    >
                                        Disable
                                    </Button>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                                        <Check className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">Approved</span>
                                    </div>
                                </>
                            )}
                            {content.status === "rejected" && (
                                <>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <span className="text-sm font-medium text-yellow-600">Reasons !</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                                        <X className="h-4 w-4 text-red-600" />
                                        <span className="text-sm font-medium text-red-600">Rejected</span>
                                    </div>
                                </>
                            )}
                            <span className="text-xs text-gray-400">{content.lastActive}</span>
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
                </Button>
            </div>
        </div>
    );
}

