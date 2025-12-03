import TotalSubscribersIcon from "@/assets/icons/totalSubscribers.svg?react";
import ActiveSubscriptionIcon from "@/assets/icons/activeSubscription.svg?react";
import RecentSubscriptionIcon from "@/assets/icons/recentSubscription.svg?react";
import ExpiredSubscriptionIcon from "@/assets/icons/expiredSubscription.svg?react";
import RecentExpiredSubIcon from "@/assets/icons/recentExpiredsub.svg?react";
import FreemiumIcon from "@/assets/icons/freemium.svg?react";

export const subscriptionStatistics = [
  {
    id: "total-subscribers",
    label: "Total Subscribers",
    value: "10",
    icon: TotalSubscribersIcon,
    highlighted: false,
  },
  {
    id: "active-subscription",
    label: "Active Subscription",
    value: "4",
    icon: ActiveSubscriptionIcon,
    highlighted: true,
  },
  {
    id: "recent-subscription",
    label: "Recent Subscription",
    value: "10",
    icon: RecentSubscriptionIcon,
    highlighted: false,
  },
  {
    id: "expired-subscription",
    label: "Expired Subscription",
    value: "10",
    icon: ExpiredSubscriptionIcon,
    highlighted: false,
  },
  {
    id: "recent-expired-sub",
    label: "Recent Expired Sub",
    value: "10",
    icon: RecentExpiredSubIcon,
    highlighted: false,
  },
  {
    id: "freemium-subscription",
    label: "Freemium Subscription",
    value: "10",
    icon: FreemiumIcon,
    highlighted: false,
  },
];

export const subscriptionTypes = [
  { id: "freemium", label: "Freemium" },
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "yearly", label: "Yearly" },
];
