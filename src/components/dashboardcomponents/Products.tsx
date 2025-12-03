import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";

const mockProducts = [
    {
        id: 1,
        name: "Dog Belt",
        productId: "PR001",
        avatar: "DB",
        lastActive: "5 mins ago",
    },
    {
        id: 2,
        name: "Cat for Sale",
        productId: "PR002",
        avatar: "CF",
        lastActive: "15 mins ago",
    },
    {
        id: 3,
        name: "Puppy For Sale",
        productId: "PR003",
        avatar: "PF",
        lastActive: "Today 12:42 PM CST",
    },
    {
        id: 4,
        name: "Dog Bed",
        productId: "PR004",
        avatar: "DB",
        lastActive: "Yesterday 12:42 PM CST",
    },
];

export function Products() {
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

            {/* Products List */}
            <div className="px-6 space-y-4">
                {mockProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {product.avatar}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">Product ID</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="destructive"
                                className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                            >
                                Disable
                            </Button>
                            <span className="text-xs text-gray-400">{product.lastActive}</span>
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

