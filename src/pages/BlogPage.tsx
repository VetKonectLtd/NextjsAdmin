import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mainNavigationTabs } from "@/constants/navigation";
import { AfricaRegionWithStats } from "@/components/dashboardcomponents/shared/AfricaRegionWithStats";
import { Blog } from "@/components/dashboardcomponents/blog/Blog";
import { cn } from "@/lib/utils";
import { useBlogStore } from "@/stores/use-blog-store";

// Icons - reusing from other constants
import TotalUsersIcon from "@/assets/icons/totalUsersIcon.svg?react";
import TotalVeterinariansIcon from "@/assets/icons/totalVeterinariansIcon.svg?react";
import TotalStoresIcon from "@/assets/icons/totalStoresIcon.svg?react";
import TotalClinicsIcon from "@/assets/icons/totalClinicsIcon.svg?react";
import TotalPetsIcons from "@/assets/icons/totalPetsIcons.svg?react";
import AnimalOwnersIcon from "@/assets/icons/animalOwnersIcon.svg?react";

export function BlogPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("blog");
    
    const { blogs, isLoading, fetchBlogs } = useBlogStore();

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    // Compute statistics from blog data
    const statistics = useMemo(() => {
        const totalBlogs = blogs.length;
        const publishedBlogs = blogs.filter(b => b.status === 'published').length;
        const draftBlogs = blogs.filter(b => b.status === 'draft').length;
        const totalViews = blogs.reduce((sum, b) => sum + parseInt(b.views_count || '0'), 0);
        const totalComments = blogs.reduce((sum, b) => sum + parseInt(b.comments_count || '0'), 0);
        const totalLikes = blogs.reduce((sum, b) => sum + parseInt(b.likes_count || '0'), 0);

        return [
            {
                id: "total-blogs",
                label: "Total Blogs",
                value: totalBlogs,
                icon: TotalUsersIcon,
                highlighted: true,
            },
            {
                id: "published-blogs",
                label: "Published",
                value: publishedBlogs,
                icon: TotalVeterinariansIcon,
                highlighted: false,
            },
            {
                id: "draft-blogs",
                label: "Drafts",
                value: draftBlogs,
                icon: TotalStoresIcon,
                highlighted: false,
            },
            {
                id: "total-views",
                label: "Total Views",
                value: totalViews,
                icon: TotalClinicsIcon,
                highlighted: false,
            },
            {
                id: "total-comments",
                label: "Total Comments",
                value: totalComments,
                icon: TotalPetsIcons,
                highlighted: false,
            },
            {
                id: "total-likes",
                label: "Total Likes",
                value: totalLikes,
                icon: AnimalOwnersIcon,
                highlighted: false,
            },
        ];
    }, [blogs]);

    return (
        <div className="min-h-screen bg-white">
            {/* Africa Region Section with Blog Statistics */}
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

            {/* Blog Content */}
            <Blog />
        </div>
    );
}
