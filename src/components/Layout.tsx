import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constants/sidebar";
import { mainNavigationTabs } from "@/constants/navigation";

interface LayoutProps {
    children: ReactNode;
}

const getPageTitle = (pathname: string): string => {
    // Check main navigation tabs first
    const mainTab = mainNavigationTabs.find((tab) => tab.path === pathname);
    if (mainTab) {
        return mainTab.label;
    }

    // Check sidebar items
    const sidebarItem = sidebarItems.find((item) => item.path === pathname);
    if (sidebarItem) {
        return sidebarItem.label;
    }

    // Check for users pages (/users or /)
    if (pathname === "/" || pathname === "/users" || pathname === "/users-features") {
        return "Users & Features";
    }

    // Default fallback
    return "Dashboard";
};

export function Layout({ children }: LayoutProps) {
    const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useSidebarStore();
    const { user } = useAuthStore();
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    const displayName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin" : "Admin";
    const userEmail = user?.email || "";
    const userInitials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "VK";
    const profileImageUrl = user?.profile_picture_url || "/avatar.png";

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar />

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 overflow-hidden",
                    // No margin on mobile, margin on desktop based on collapsed state
                    "ml-0 lg:ml-64",
                    isCollapsed && "lg:ml-20"
                )}
            >
                {/* Top Bar with Toggle Button and Profile */}
                <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile hamburger menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(!isMobileOpen)}
                            className="hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        
                        {/* Desktop toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="hover:bg-gray-100 hidden lg:flex"
                        >
                            {isCollapsed ? (
                                <Menu className="h-5 w-5" />
                            ) : (
                                <X className="h-5 w-5" />
                            )}
                        </Button>
                        
                        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                            {pageTitle}
                        </h1>
                    </div>

                    {/* Profile Area */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-gray-900 text-sm truncate max-w-[120px] lg:max-w-none">
                                {displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px] lg:max-w-none">
                                {userEmail}
                            </p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                            {user?.profile_picture_url ? (
                                <img 
                                    src={profileImageUrl} 
                                    alt={displayName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-orange-400', 'to-orange-600');
                                        e.currentTarget.parentElement!.innerHTML = userInitials;
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-sm sm:text-base">
                                    {userInitials}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
