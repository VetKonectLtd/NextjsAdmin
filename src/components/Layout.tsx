import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useSidebarStore } from "@/stores/use-sidebar-store";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebarFooterLinks, sidebarItems } from "@/constants/sidebar";
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
    const { isCollapsed, toggleSidebar } = useSidebarStore();
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar />

            {/* Main Content Area */}
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 overflow-hidden",
                    isCollapsed ? "ml-20" : "ml-64"
                )}
            >
                {/* Top Bar with Toggle Button and Profile */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="hover:bg-gray-100"
                        >
                            {isCollapsed ? (
                                <Menu className="h-5 w-5" />
                            ) : (
                                <X className="h-5 w-5" />
                            )}
                        </Button>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {pageTitle}
                        </h1>
                    </div>

                    {/* Profile Area */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="font-semibold text-gray-900 text-sm">
                                {sidebarFooterLinks.profile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {sidebarFooterLinks.profile.email}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0 overflow-hidden">
                            VK
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}

