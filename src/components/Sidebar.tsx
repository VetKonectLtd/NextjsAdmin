import { useSidebarStore } from "@/stores/use-sidebar-store";
import { sidebarItems, sidebarFooterLinks, socialIconMap } from "@/constants/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import LogoIcon from "@/assets/logo.svg?react";

export function Sidebar() {
    const { isCollapsed } = useSidebarStore();
    const location = useLocation();

    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-full bg-gray-50 transition-all duration-300 z-50 flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "")}>
                <LogoIcon className="w-12 h-12 flex-shrink-0" />
                {!isCollapsed && (
                    <span className="ml-2 text-xl font-bold text-gray-800 whitespace-nowrap">
                        Vet Konect
                    </span>
                )}
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link key={item.id} to={item.path}>
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                className={cn(
                                    "w-full gap-3",
                                    isActive && "bg-gray-200 hover:bg-gray-200 text-gray-900",
                                    isCollapsed ? "justify-center px-2" : "justify-start"
                                )}
                            >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section - Only show when expanded */}
            {!isCollapsed && (
                <div className="px-4 py-6 border-t border-gray-200 space-y-4">
                    {/* Legal Links */}
                    <div className="space-y-2">
                        {sidebarFooterLinks.legal.map((link) => (
                            <a
                                key={link.path}
                                href={link.path}
                                className="block text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{sidebarFooterLinks.contact.email}</p>
                        <p className="text-gray-600">
                            {sidebarFooterLinks.contact.whatsapp}
                        </p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex gap-3">
                        {sidebarFooterLinks.social.map((social) => {
                            const Icon =
                                socialIconMap[
                                social.icon as keyof typeof socialIconMap
                                ];
                            if (!Icon) return null;
                            return (
                                <a
                                    key={social.name}
                                    href={social.path}
                                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                    <Icon className="h-4 w-4 text-gray-600" />
                                </a>
                            );
                        })}
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            VK
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                                {sidebarFooterLinks.profile.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {sidebarFooterLinks.profile.email}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed Profile - Only show when collapsed */}
            {isCollapsed && (
                <div className="p-4 border-t border-gray-200 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold">
                        VK
                    </div>
                </div>
            )}
        </div>
    );
}

