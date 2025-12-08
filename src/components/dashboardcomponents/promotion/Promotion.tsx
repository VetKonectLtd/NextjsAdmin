import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {  Loader2, ChevronDown, ChevronUp, MapPin, SearchSlash, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ManageButton } from "@/components/shared/ManageButton";
import { usePromotionStore } from "@/stores/use-promotion-store";
import { CreatePromotionModal } from "./CreatePromotionModal";
import type { UserPromotion, PromotionPlan } from "@/types/promotion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function Promotion() {
    const [searchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Confirmation Modal State
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => Promise<void>;
        isLoading: boolean;
        variant?: "danger" | "warning" | "info";
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: "",
        description: "",
        action: async () => {},
        isLoading: false,
        variant: "danger"
    });

    const [editingPlan, setEditingPlan] = useState<PromotionPlan | null>(null);
    const [activeTab, setActiveTab] = useState<string>("");
    
    // Store
    const { 
        promotions, 
        fetchPromotions, 
        promotionUsers,
        fetchPromotionUsers,
        togglePromotionStatus,
        deletePromotion,
        expireUserPromotion,
        isLoading 
    } = usePromotionStore();

    // Fetch plans on mount
    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    // Set initial active tab when plans load
    useEffect(() => {
        if (promotions.length > 0 && !activeTab) {
            setActiveTab(promotions[0].title);
        }
    }, [promotions, activeTab]);

    // Fetch users when active tab changes
    useEffect(() => {
        if (activeTab) {
            fetchPromotionUsers(activeTab);
        }
    }, [activeTab, fetchPromotionUsers]);

    // Handle edit plan
    const handleEditPlan = () => {
        const activePlan = promotions.find(p => p.title === activeTab);
        if (activePlan) {
            setEditingPlan(activePlan);
            setIsCreateModalOpen(true);
        }
    };

    // Handle delete plan with custom confirmation
    const handleDeletePlan = () => {
        const activePlan = promotions.find(p => p.title === activeTab);
        if (activePlan) {
            setConfirmationModal({
                isOpen: true,
                title: "Delete Promotion Plan",
                description: `Are you sure you want to delete the "${activePlan.title}" promotion plan? This action cannot be undone.`,
                confirmLabel: "Delete Plan",
                variant: "danger",
                isLoading: false,
                action: async () => {
                    setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                    try {
                        await deletePromotion(activePlan.id);
                        setActiveTab("");
                        setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                    } catch {
                        setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                    }
                }
            });
        }
    };
    
    // Helper to close confirmation modal
    const closeConfirmation = () => {
        if (!confirmationModal.isLoading) {
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    // Close modal handler
    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingPlan(null);
    };

    // Filter logic
    const filteredUsers = promotionUsers.flatMap(data => 
        data.promotions.map(promo => ({
            ...promo,
            user: data.user
        }))
    ).filter(item => 
        (item.user.first_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.user.last_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (item.product.product_name?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white">
            <ManageButton 
                label="Manage Promotion" 
                onClick={() => setIsCreateModalOpen(true)}
            />

            <CreatePromotionModal 
                isOpen={isCreateModalOpen} 
                onClose={handleCloseModal}
                editingPlan={editingPlan}
            />

            {/* Dynamic Tabs */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4 overflow-x-auto">
                <div className="flex items-center gap-6 min-w-max relative">
                    {promotions.map((plan) => {
                        const isActive = activeTab === plan.title;
                        return (
                            <div key={plan.id} className="relative flex items-center gap-2">
                                <button
                                    onClick={() => setActiveTab(plan.title)}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                >
                                    {plan.title.charAt(0).toUpperCase() + plan.title.slice(1)}
                                </button>
                                
                                {/* Dropdown for active tab */}
                                {isActive && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="p-1 hover:bg-gray-100 rounded transition-colors outline-none"
                                                aria-label="Plan options"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-48">
                                            <DropdownMenuItem onClick={handleEditPlan} className="cursor-pointer">
                                                <Edit2 className="mr-2 h-4 w-4" />
                                                <span>Edit Plan</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDeletePlan} className="cursor-pointer text-red-600 focus:text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete Plan</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        );
                    })}
                </div>
            </nav>

            {/* Search */}
            {/* <div className="px-6 py-6 flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search users or products"
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

            {/* Content List */}
            <div className="px-6 space-y-4 pb-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <SearchSlash className="h-12 w-12 mb-2 opacity-50" />
                        <p>No active promotions found for this plan.</p>
                    </div>
                ) : (
                    filteredUsers.map((item, index) => (
                        <PromotionCard 
                            key={`${item.id}-${index}`} 
                            item={item} 
                            onToggleStatus={() => togglePromotionStatus(
                                parseInt(item.user_id), 
                                item.active_role, 
                                item.status, 
                                activeTab
                            )}
                            onExpire={(id) => {
                                setConfirmationModal({
                                    isOpen: true,
                                    title: "Expire Promotion",
                                    description: "Are you sure you want to expire this user's promotion? This will immediately end their promotion benefits.",
                                    confirmLabel: "Expire Promotion",
                                    variant: "warning",
                                    isLoading: false,
                                    action: async () => {
                                        setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                                        try {
                                            await expireUserPromotion(id, activeTab);
                                            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                            } catch { // eslint-delete
                                setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                            }
                                    }
                                });
                            }} 
                        />
                    ))
                )}
            </div>

            <ConfirmationModal
                isOpen={confirmationModal.isOpen}
                onClose={closeConfirmation}
                onConfirm={confirmationModal.action}
                title={confirmationModal.title}
                description={confirmationModal.description}
                confirmLabel={confirmationModal.confirmLabel}
                variant={confirmationModal.variant}
                isLoading={confirmationModal.isLoading}
            />
        </div>
    );
}

function PromotionCard({ 
    item, 
    onToggleStatus,
    onExpire
}: { 
    item: UserPromotion & { user: import("@/types/promotion").PromotionUser }; 
    onToggleStatus: () => void; 
    onExpire: (id: number) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Determine status color and label
    const isActive = item.status === 'active';
    const isExpired = item.computed_status === 'expired' || item.status === 'expired';
    const isCancelled = item.status === 'cancelled';

    let statusColor = "text-green-600 bg-green-50 border-green-200";
    let statusLabel = "Active";

    if (isExpired) {
        statusColor = "text-orange-600 bg-orange-50 border-orange-200";
        statusLabel = "Expired";
    } else if (isCancelled) {
        statusColor = "text-red-600 bg-red-50 border-red-200";
        statusLabel = "Deactivated";
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Header / Summary */}
            <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.user.profile?.profile_image_url ? (
                            <img 
                                src={item.user.profile.profile_image_url} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-700 font-bold">
                                {item.user.first_name.charAt(0)}{item.user.last_name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {item.user.first_name} {item.user.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{item.user.activeRoleName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Expire Button */}
                    {!isExpired && !isCancelled && (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-3 text-xs"
                            onClick={(e) => {
                                e.stopPropagation();
                                onExpire(item.id);
                            }}
                        >
                            Expire
                        </Button>
                    )}
                    
                    <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", statusColor)}>
                        {statusLabel}
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
            </div>

            {/* Expanded Content: Product Details */}
            {isExpanded && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                    <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                             {item.product.images_url && item.product.images_url.length > 0 ? (
                                <img 
                                    src={item.product.images_url[0]} 
                                    alt={item.product.product_name} 
                                    className="w-full h-full object-cover"
                                />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                                    No Image
                                </div>
                             )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-lg">{item.product.product_name}</h4>
                                    <div className="flex items-center text-gray-500 text-xs mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {item.product.location}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 text-lg">
                                        {item.promotion_plan.currency} {item.product.price}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Ends: {new Date(item.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 line-clamp-2">
                                {item.product.description}
                            </p>

                            <div className="flex justify-end pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleStatus();
                                    }}
                                    className={cn(
                                        "min-w-[100px]",
                                        isActive 
                                            ? "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                            : "text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                    )}
                                >
                                    {isActive ? "Deactivate" : "Activate"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
