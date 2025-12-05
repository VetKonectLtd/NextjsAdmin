import DashboardIcon from "@/assets/icons/dashboardIcon.svg?react";
import UserIcon from "@/assets/icons/userIcon.svg?react";
import ForumIcon from "@/assets/icons/forumIcon.svg?react";
import SubscriptionIcon from "@/assets/icons/subscriptionIcon.svg?react";
import PromotionIcon from "@/assets/icons/promotionIcon.svg?react";
import ActivityIcon from "@/assets/icons/activityIcon.svg?react";
import AccountIcon from "@/assets/icons/accountIcon.svg?react";
import LogoutIcon from "@/assets/icons/logoutIcon.svg?react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: DashboardIcon,
    path: "/",
  },
  {
    id: "users-features",
    label: "Users & Features",
    icon: UserIcon,
    path: "/users",
  },
  {
    id: "forum-contents",
    label: "Forum Contents",
    icon: ForumIcon,
    path: "/content",
  },
  {
    id: "subscription",
    label: "Subscription",
    icon: SubscriptionIcon,
    path: "/subscription",
  },
  {
    id: "promotion",
    label: "Promotion",
    icon: PromotionIcon,
    path: "/promotion",
  },
  {
    id: "activity-history",
    label: "Activity History",
    icon: ActivityIcon,
    path: "/activities",
  },
  {
    id: "my-account",
    label: "My Account",
    icon: AccountIcon,
    path: "/account",
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogoutIcon,
    path: "/logout",
  },
];

export const sidebarFooterLinks = {
  legal: [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "About Vet konect", path: "/about" },
    { label: "Sitemap", path: "/sitemap" },
  ],
  contact: {
    email: "Supports@vetkonect.com",
    whatsapp: "WhatsApp: +23400000000",
  },
  social: [
    { name: "LinkedIn", icon: "linkedin", path: "#" },
    { name: "Twitter", icon: "twitter", path: "#" },
    { name: "Discord", icon: "discord", path: "#" },
    { name: "Slack", icon: "slack", path: "#" },
    { name: "Facebook", icon: "facebook", path: "#" },
  ],
  profile: {
    name: "Vet Konect",
    email: "vkadmin@gmail.com",
    avatar: "/avatar.png", // Placeholder
  },
};

import LinkedInIcon from "@/assets/icons/linkedinIcon.svg?react";
import TwitterIcon from "@/assets/icons/twitterIcon.svg?react";
import DiscordIcon from "@/assets/icons/discordIcon.svg?react";
import SlackIcon from "@/assets/icons/slackIcon.svg?react";
import FacebookIcon from "@/assets/icons/facebookIcon.svg?react";

export const socialIconMap = {
  linkedin: LinkedInIcon,
  twitter: TwitterIcon,
  discord: DiscordIcon,
  slack: SlackIcon,
  facebook: FacebookIcon,
};

export const userCategories = [
  { id: "pet-owners", label: "Pet Owners", path: "/users/pet-owners" },
  { id: "veterinarians", label: "Veterinarians", path: "/users/veterinarians" },
  { id: "paraprofessionals", label: "Paraprofessionals", path: "/users/paraprofessionals" },
  { id: "veterinary-clinic", label: "Veterinary Clinic", path: "/users/veterinary-clinic" },
  { id: "store", label: "Store", path: "/users/store" },
  { id: "livestock-farmers", label: "Livestock Farmers", path: "/users/livestock-farmers" },
  { id: "products", label: "Products", path: "/users/products" },
  { id: "others", label: "Others", path: "/users/others" },
];
