import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { Content } from "@/components/dashboardcomponents/forum-contents/Content";
import { cn } from "@/lib/utils";
import { useForumStore } from "@/stores/use-forum-store";

// Icons
import RecentPublishedIcon from "@/assets/icons/recentPublished.svg?react";
import RecentViewedIcon from "@/assets/icons/recentViewed.svg?react";
import RecentLikedIcon from "@/assets/icons/recentLiked.svg?react";
import RecentCommentIcon from "@/assets/icons/recentComment.svg?react";
import TrendingContentIcon from "@/assets/icons/trendingContent.svg?react";
import ActiveUsersIcon from "@/assets/icons/activeUsers.svg?react";

export function ContentPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("content");

    const { forums, isLoading, fetchForums } = useForumStore();

    useEffect(() => {
        fetchForums();
    }, [fetchForums]);

    // Compute statistics from forum/content data
    const statistics = useMemo(() => {
        const forumsList = forums?.data ?? [];
        const totalForums = forumsList.length;
        const approvedForums = forumsList.filter(f => f.status === 'published').length;
        const pendingForums = forumsList.filter(f => f.status === 'in-review').length;
        const totalLikes = forumsList.reduce((sum: number, f) => sum + (parseInt(String(f.likes_count)) || 0), 0);
        const totalComments = forumsList.reduce((sum: number, f) => sum + (parseInt(String(f.comments_count)) || 0), 0);
        const totalViews = forumsList.reduce((sum: number, f) => sum + (parseInt(String(f.views_count)) || 0), 0);

        return [
            {
                id: "total-content",
                label: "Total Content",
                value: totalForums,
                icon: RecentPublishedIcon,
                highlighted: true,
            },
            {
                id: "approved-content",
                label: "Approved",
                value: approvedForums,
                icon: RecentViewedIcon,
                highlighted: false,
            },
            {
                id: "pending-content",
                label: "Pending Review",
                value: pendingForums,
                icon: RecentLikedIcon,
                highlighted: false,
            },
            {
                id: "total-comments",
                label: "Total Comments",
                value: totalComments,
                icon: RecentCommentIcon,
                highlighted: false,
            },
            {
                id: "total-likes",
                label: "Total Likes",
                value: totalLikes,
                icon: TrendingContentIcon,
                highlighted: false,
            },
            {
                id: "total-views",
                label: "Total Views",
                value: totalViews,
                icon: ActiveUsersIcon,
                highlighted: false,
            },
        ];
    }, [forums]);

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Content Statistics */}
            <AfricaRegionWithStats statistics={statistics} isLoading={isLoading} />

            {/* Main Navigation Tabs */}
            <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
                <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
                    {mainNavigationTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                navigate(tab.path);
                            }}
                            className={cn(
                                "px-3 sm:px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
                                activeTab === tab.id
                                    ? "text-gray-900 font-bold text-base border-b-2 border-green-500"
                                    : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content List */}
            <Content />
        </div>
    );
}
