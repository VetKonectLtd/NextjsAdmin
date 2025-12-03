import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, UserPlus, Users, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const mockVeterinarians = [
    {
        id: 1,
        name: "Dr. Amechi Anayor",
        role: "Veterinarian",
        avatar: "AA",
        status: "pending",
        lastActive: "15 mins ago",
    },
    {
        id: 2,
        name: "Dr. Shadrack",
        role: "Veterinarian",
        avatar: "DS",
        status: "pending",
        lastActive: "15 mins ago",
    },
    {
        id: 3,
        name: "Dr. Jones Buganda",
        role: "Veterinarian",
        avatar: "JB",
        status: "approved",
        lastActive: "Today 12:42 PM CST",
    },
];

export function Veterinarians() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-white">
            {/* Action Buttons */}
            <div className="px-6 py-4 flex gap-4">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Users className="h-4 w-4 mr-2" />
                    All Veterinarian
                </Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Veterinarian
                </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="px-6 pb-6 flex items-center gap-4">
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

            {/* Veterinarian List */}
            <div className="px-6 space-y-4">
                {mockVeterinarians.map((vet) => (
                    <div
                        key={vet.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {vet.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 underline">{vet.name}</h3>
                            <p className="text-sm text-gray-500">{vet.role}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            {vet.status === "approved" ? (
                                <>
                                    <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
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
                            <span className="text-xs text-gray-400">{vet.lastActive}</span>
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

