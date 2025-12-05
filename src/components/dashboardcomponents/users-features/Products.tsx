import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";

export function Products() {
    const [searchQuery, setSearchQuery] = useState("");
    const { products, fetchProducts, isLoading } = useUserStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (isLoading && !products) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

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

            {/* Product List */}
            <div className="px-6 space-y-4">
                {products?.data.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                    >
                        {/* Product Image */}
                        {product.images_url?.[0] ? (
                            <img 
                                src={product.images_url[0]} 
                                alt={product.product_name} 
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                No Img
                            </div>
                        )}

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                            <p className="text-sm text-gray-500">{product.category} - {product.price}</p>
                            <p className="text-xs text-gray-400">Store: {product.store?.store_name}</p>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant={product.disabled === "0" ? "destructive" : "default"}
                                className={
                                    product.disabled === "0"
                                        ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                }
                            >
                                {product.disabled === "0" ? "Disable" : "Enable"}
                            </Button>
                            <span className="text-xs text-gray-400">
                                {new Date(product.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More Button */}
            {products?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchProducts(products.current_page + 1)}
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
