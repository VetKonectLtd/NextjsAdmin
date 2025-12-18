import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Check, X, AlertCircle, Loader2, Trash2, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useForumStore } from "@/stores/use-forum-store";
import { DatePill } from "@/components/ui/date-pill";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export function Content() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const { forums, fetchForums, searchForums, approveForum, rejectForum, deleteForum, isLoading, error } = useForumStore();

    // Confirmation modal state
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

    const closeConfirmation = () => {
        if (!confirmationModal.isLoading) {
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleDelete = (id: number) => {
        setConfirmationModal({
            isOpen: true,
            title: "Delete Forum Post",
            description: "Are you sure you want to delete this forum post? This action cannot be undone.",
            confirmLabel: "Delete",
            variant: "danger",
            isLoading: false,
            action: async () => {
                setConfirmationModal(prev => ({ ...prev, isLoading: true }));
                try {
                    await deleteForum(id);
                    setConfirmationModal(prev => ({ ...prev, isOpen: false, isLoading: false }));
                } catch {
                    setConfirmationModal(prev => ({ ...prev, isLoading: false }));
                }
            }
        });
    };

    useEffect(() => {
        fetchForums();
    }, [fetchForums]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchForums(searchQuery);
        } else {
            fetchForums();
        }
    };

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "in-review":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        In Review
                    </span>
                );
            case "published":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        <Check className="h-3 w-3" />
                        Published
                    </span>
                );
            case "archived":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        <X className="h-3 w-3" />
                        Archived
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading && !forums) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !forums) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load forums</h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button onClick={() => fetchForums()} className="bg-green-500 hover:bg-green-600 text-white">
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
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
                <Button 
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSearch}
                >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300 hidden sm:flex">
                    <Filter className="h-4 w-4" />
                </Button>
            </div>

            {/* Content List */}
            <div className="px-4 sm:px-6 space-y-3 sm:space-y-4 pb-6">
                {(!forums?.data || forums.data.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No forums found</h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery ? "Try adjusting your search query" : "Forum posts will appear here once users create them"}
                        </p>
                    </div>
                ) : (
                    forums.data.map((content) => (
                    <div
                        key={content.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                        {/* Card Header - Clickable to expand */}
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer"
                            onClick={() => toggleExpand(content.id)}
                        >
                            <div className="flex-1 flex items-center gap-3">
                                {/* Author Avatar */}
                                {content.author?.image ? (
                                    <img 
                                        src={content.author.image} 
                                        alt={content.author.name} 
                                        className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                        {content.author?.name?.[0] || "U"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{content.title}</h3>
                                        {getStatusBadge(content.status)}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        By {content.author?.name || "Unknown"} • {content.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <DatePill date={content.created_at} />
                                {expandedId === content.id ? (
                                    <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedId === content.id && (
                            <div className="border-t border-gray-100 bg-gray-50 p-4">
                                {/* Forum Content */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Content</h4>
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded-md border border-gray-200">
                                        {content.content}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 mb-4 text-xs text-gray-500">
                                    <span>👁 {content.views_count} views</span>
                                    <span>💬 {content.comments_count} comments</span>
                                    <span>❤️ {content.likes_count} likes</span>
                                    <span>🔗 {content.shares_count} shares</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    {content.status === "in-review" && (
                                        <>
                                            <Button 
                                                size="sm"
                                                className="bg-green-500 hover:bg-green-600 text-white"
                                                onClick={(e) => { e.stopPropagation(); approveForum(content.id, content.user_id, content.author?.active_role || ''); }}
                                            >
                                                <Check className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                                onClick={(e) => { e.stopPropagation(); rejectForum(content.id, content.user_id, content.author?.active_role || ''); }}
                                            >
                                                <X className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {content.status === "published" && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="bg-white text-red-600 border border-red-600 hover:bg-red-50"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(content.id); }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                    {content.status === "archived" && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm font-medium text-yellow-600">This forum has been archived</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))
                )}
            </div>

            {/* Load More Button */}
            {forums?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchForums(forums.current_page + 1)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Loading more..."}
                    </Button>
                </div>
            )}

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

