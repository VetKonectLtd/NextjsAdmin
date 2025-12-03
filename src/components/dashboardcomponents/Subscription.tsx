import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscriptionTypes } from "@/constants/subscription";
import { ManageButton } from "@/components/shared/ManageButton";

const mockSubscribers = [
    {
        id: 1,
        name: "Dr. Amechi Anayor",
        role: "Veterinarian",
        avatar: "AA",
        status: "active",
        lastActive: "15 mins ago",
    },
    {
        id: 2,
        name: "Dr. Shadrack",
        role: "Veterinarian",
        avatar: "DS",
        status: "active",
        lastActive: "15 mins ago",
    },
    {
        id: 3,
        name: "Dr. Jones Buganda",
        role: "Veterinarian",
        avatar: "JB",
        status: "active",
        lastActive: "Today 12:42 PM CST",
    },
    {
        id: 4,
        name: "Dr. Alli Pomoko",
        role: "Veterinarian",
        avatar: "AP",
        status: "expired",
        lastActive: "20 mins ago",
    },
    {
        id: 5,
        name: "Dr. Funmilavo Emiolaju",
        role: "Veterinarian",
        avatar: "FE",
        status: "active",
        lastActive: "15 mins ago",
    },
];

export function Subscription() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeType, setActiveType] = useState("freemium");

    return (
        <div className="min-h-screen bg-white">
            {/* Manage Subscription Button */}
            <ManageButton label="Manage Subscription" />

            {/* Subscription Type Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-6">
                    {subscriptionTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveType(type.id)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium transition-colors",
                                activeType === type.id
                                    ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </nav>

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

            {/* Subscriber List */}
            <div className="px-6 space-y-4 pb-6">
                {mockSubscribers.map((subscriber) => (
                    <div
                        key={subscriber.id}
                        className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {subscriber.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{subscriber.name}</h3>
                            <p className="text-sm text-gray-500">{subscriber.role}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="destructive"
                                className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                            >
                                Disable
                            </Button>
                            {subscriber.status === "active" ? (
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                                    <X className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">Expired</span>
                                </div>
                            )}
                            <span className="text-xs text-gray-400">{subscriber.lastActive}</span>
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

