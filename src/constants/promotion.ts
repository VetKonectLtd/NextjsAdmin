import TotalPromotionsIcon from "@/assets/icons/totalPromotions.svg?react";
import ActivePromotionsIcon from "@/assets/icons/activePromotions.svg?react";
import RecentPromotionsIcon from "@/assets/icons/recentPromotions.svg?react";
import ExpiredPromotionsIcon from "@/assets/icons/expiredPromotions.svg?react";
import RecentExpiredIcon from "@/assets/icons/recentExpired.svg?react";
import TrialPromotionIcon from "@/assets/icons/trialpromotion.svg?react";

export const promotionStatistics = [
  {
    id: "total-promotion",
    label: "Total Promotion",
    value: "10",
    icon: TotalPromotionsIcon,
    highlighted: false,
  },
  {
    id: "active-promotion",
    label: "Active Promotion",
    value: "4",
    icon: ActivePromotionsIcon,
    highlighted: true,
  },
  {
    id: "recent-promotion",
    label: "Recent Promotion",
    value: "10",
    icon: RecentPromotionsIcon,
    highlighted: false,
  },
  {
    id: "expired-promotion",
    label: "Expired Promotion",
    value: "10",
    icon: ExpiredPromotionsIcon,
    highlighted: false,
  },
  {
    id: "recent-expired-pro",
    label: "Recent Expired Pro.",
    value: "10",
    icon: RecentExpiredIcon,
    highlighted: false,
  },
  {
    id: "trial-promotion",
    label: "Trial Promotion",
    value: "10",
    icon: TrialPromotionIcon,
    highlighted: false,
  },
];

export const promotionTypes = [
  { id: "free-trial", label: "Free Trial" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];
