import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { ManageButton } from "@/components/shared/ManageButton";
import { useSubscriptionStore } from "@/stores/use-subscription-store";
import { CreateSubscriptionModal } from "./CreateSubscriptionModal";


export function Subscription() {
    // const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { 
        subscribers, 
        fetchSubscribersByType, 
        isLoading,
        plans,
        fetchPlans 
    } = useSubscriptionStore();
    
    // Initialize activeType with empty string, will be set when plans load
    const [activeType, setActiveType] = useState<string>("");

    // Fetch plans on mount
    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    // Set active type to first plan when plans are loaded and no active type is set
    useEffect(() => {
        if (plans.length > 0 && !activeType) {
            // Use the first plan's title relative to backend expectations
            // The backend expects "freemium", "monthly", etc. 
            // We'll assume the title lowercased is the key, or we might need a mapping.
            // For now, let's use the title lowercased.
            const initialType = plans[0].subscription_title.toLowerCase();
            setActiveType(initialType);
        }
    }, [plans, activeType]);

    useEffect(() => {
        if (activeType) {
            fetchSubscribersByType(activeType);
        }
    }, [activeType, fetchSubscribersByType]);

    const filteredSubscribers = subscribers.filter(subscriber => 
        (subscriber.first_name?.toLowerCase() || "").includes("") ||
        (subscriber.last_name?.toLowerCase() || "").includes("") ||
        (subscriber.email?.toLowerCase() || "").includes("")
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Manage Subscription Button */}
            <ManageButton 
                label="Manage Subscription" 
                onClick={() => setIsCreateModalOpen(true)}
            />

            {/* Create Subscription Modal */}
            <CreateSubscriptionModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
            />

            {/* Subscription Type Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-6 overflow-x-auto">
                    {plans.map((plan) => {
                         const typeId = plan.subscription_title.toLowerCase();
                         return (
                            <button
                                key={plan.id}
                                onClick={() => setActiveType(typeId)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                    activeType === typeId
                                        ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                        : "text-gray-600 hover:text-gray-900"
                                )}
                            >
                                {plan.subscription_title}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Search and Filter Section */}
            {/* <div className="px-6 py-6 flex items-center gap-4">
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
            </div> */}

            {/* Subscriber List */}
            <div className="px-6 space-y-4 pb-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No subscribers found for this plan.
                    </div>
                ) : (
                    filteredSubscribers.map((subscriber) => {
                         const displayName = `${subscriber.first_name || ""} ${subscriber.last_name || ""}`.trim() || "User";
                         const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                         const isUserActive = subscriber.is_active === 1 || subscriber.is_active === true;
                         
                         return (
                            <div
                                key={subscriber.id}
                                className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 overflow-hidden">
                                    {subscriber.photo ? (
                                        <img 
                                            src={subscriber.photo} 
                                            alt={displayName} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-400', 'to-blue-600');
                                                e.currentTarget.parentElement!.innerHTML = initials;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                            {initials}
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                                    <p className="text-sm text-gray-500 truncate">{subscriber.user_type || "User"}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <Button
                                        variant="destructive"
                                        className="bg-white text-red-600 border border-red-600 hover:bg-red-50 hidden sm:flex"
                                    >
                                        Disable
                                    </Button>
                                    
                                    {isUserActive ? (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                                            <Check className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium text-green-600 hidden sm:inline">Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
                                            <X className="h-4 w-4 text-red-600" />
                                            <span className="text-sm font-medium text-red-600 hidden sm:inline">Inactive</span>
                                        </div>
                                    )}
                                    
                                    <span className="text-xs text-gray-400 whitespace-nowrap hidden md:inline">
                                        {subscriber.last_seen ? new Date(subscriber.last_seen).toLocaleString() : "Offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
