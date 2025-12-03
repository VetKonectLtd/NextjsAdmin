import RecentPublishedIcon from "@/assets/icons/recentPublished.svg?react";
import RecentViewedIcon from "@/assets/icons/recentViewed.svg?react";
import RecentLikedIcon from "@/assets/icons/recentLiked.svg?react";
import RecentCommentIcon from "@/assets/icons/recentComment.svg?react";
import TrendingContentIcon from "@/assets/icons/trendingContent.svg?react";
import ActiveUsersIcon from "@/assets/icons/activeUsers.svg?react";

export const contentStatistics = [
  {
    id: "recent-published",
    label: "Recent Published",
    value: "4",
    icon: RecentPublishedIcon,
    highlighted: true,
  },
  {
    id: "recent-viewed",
    label: "Recent Viewed",
    value: "10",
    icon: RecentViewedIcon,
    highlighted: false,
  },
  {
    id: "recent-liked",
    label: "Recent Liked",
    value: "10",
    icon: RecentLikedIcon,
    highlighted: false,
  },
  {
    id: "recent-comment",
    label: "Recent Comment",
    value: "10",
    icon: RecentCommentIcon,
    highlighted: false,
  },
  {
    id: "trending-content",
    label: "Trending Content",
    value: "10",
    icon: TrendingContentIcon,
    highlighted: false,
  },
  {
    id: "active-users",
    label: "Active Users",
    value: "10",
    icon: ActiveUsersIcon,
    highlighted: false,
  },
];
