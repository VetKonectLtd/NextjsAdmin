import { useSidebarStore } from "@/stores/use-sidebar-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { sidebarItems, sidebarFooterLinks, socialIconMap } from "@/constants/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoIcon from "@/assets/logo.svg?react";
import { toast } from "sonner";
import { X } from "lucide-react";

export function Sidebar() {
    const { isCollapsed, isMobileOpen, closeMobile } = useSidebarStore();
    const { logout, user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    const displayName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin" : "Admin";
    const userEmail = user?.email || "";
    const userInitials = displayName.split(" ").map((name) => name[0]).join("").toUpperCase().slice(0, 2) || "VK";
    const profileImageUrl = user?.profile_picture_url || "/avatar.png";

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch {
            toast.error("Failed to logout");
        }
    };

    return (
        <>
            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="fixed inset-0 z-40 bg-gray-950/40 backdrop-blur-[2px] lg:hidden"
                    onClick={closeMobile}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 hidden flex-col border-r border-gray-200 bg-white shadow-sm transition-[width] duration-300 lg:flex",
                    isCollapsed ? "w-20" : "w-64",
                )}
            >
                <SidebarPanel
                    collapsed={isCollapsed}
                    displayName={displayName}
                    userEmail={userEmail}
                    userInitials={userInitials}
                    profileImageUrl={profileImageUrl}
                    hasProfileImage={Boolean(user?.profile_picture_url)}
                    location={location}
                    onLogout={handleLogout}
                />
            </aside>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full",
                )}
                aria-label="Main navigation"
            >
                <SidebarPanel
                    collapsed={false}
                    displayName={displayName}
                    userEmail={userEmail}
                    userInitials={userInitials}
                    profileImageUrl={profileImageUrl}
                    hasProfileImage={Boolean(user?.profile_picture_url)}
                    location={location}
                    onLogout={async () => {
                        await handleLogout();
                        closeMobile();
                    }}
                    onClose={closeMobile}
                />
            </aside>
        </>
    );
}

interface SidebarPanelProps {
    collapsed: boolean;
    displayName: string;
    userEmail: string;
    userInitials: string;
    profileImageUrl: string;
    hasProfileImage: boolean;
    location: ReturnType<typeof useLocation>;
    onLogout: () => Promise<void>;
    onClose?: () => void;
}

function SidebarPanel({
    collapsed,
    displayName,
    userEmail,
    userInitials,
    profileImageUrl,
    hasProfileImage,
    location,
    onLogout,
    onClose,
}: SidebarPanelProps) {
    const navigationItems = sidebarItems.filter((item) => item.id !== "logout");
    const logoutItem = sidebarItems.find((item) => item.id === "logout");
    const LogoutIcon = logoutItem?.icon;

    return (
        <>
            <div
                className={cn(
                    "flex h-[76px] shrink-0 items-center border-b border-gray-100 px-5",
                    collapsed && "justify-center px-3",
                )}
            >
                <LogoIcon className="h-10 w-10 shrink-0" />
                {!collapsed && (
                    <div className="ml-3 min-w-0">
                        <p className="truncate text-base font-bold tracking-tight text-gray-900">Vet Konect</p>
                        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                            Admin workspace
                        </p>
                    </div>
                )}
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Close navigation menu"
                        onClick={onClose}
                        className="ml-auto h-9 w-9 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
                {!collapsed && (
                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Workspace
                    </p>
                )}
                <div className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                title={collapsed ? item.label : undefined}
                                aria-current={isActive ? "page" : undefined}
                                onClick={onClose}
                                className={cn(
                                    "group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                                    collapsed && "justify-center px-0",
                                    isActive
                                        ? "bg-green-50 text-green-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                            >
                                {isActive && (
                                    <span className="absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-green-600" />
                                )}
                                <Icon
                                    className={cn(
                                        "h-[18px] w-[18px] shrink-0",
                                        isActive ? "text-green-700" : "text-gray-400 group-hover:text-gray-600",
                                    )}
                                />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {LogoutIcon && logoutItem && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                        {!collapsed && (
                            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                                Account
                            </p>
                        )}
                        <Button
                            variant="ghost"
                            title={collapsed ? logoutItem.label : undefined}
                            onClick={onLogout}
                            className={cn(
                                "h-11 w-full justify-start gap-3 rounded-lg px-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700",
                                collapsed && "justify-center px-0",
                            )}
                        >
                            <LogoutIcon className="h-[18px] w-[18px] shrink-0" />
                            {!collapsed && <span>{logoutItem.label}</span>}
                        </Button>
                    </div>
                )}
            </nav>

            {!collapsed && (
                <div className="shrink-0 border-t border-gray-100 bg-gray-50/70 px-4 py-4">
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3">
                        <ProfileAvatar
                            displayName={displayName}
                            initials={userInitials}
                            imageUrl={profileImageUrl}
                            hasImage={hasProfileImage}
                        />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900">{displayName}</p>
                            <p className="truncate text-xs text-gray-500">{userEmail}</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 gap-x-3">
                            {sidebarFooterLinks.social.map((social) => {
                                const Icon = socialIconMap[social.icon as keyof typeof socialIconMap];
                                if (!Icon) return null;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.path}
                                        target="_blank"
                                        aria-label={social.name}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-gray-700"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                );
                            })}
                        </div>
                        <a
                            href={`mailto:${sidebarFooterLinks.contact.email}`}
                            className="truncate text-[11px] font-medium text-gray-500 hover:text-green-700"
                            title={sidebarFooterLinks.contact.email}
                        >
                            Support
                        </a>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                        {sidebarFooterLinks.legal.map((link) => (
                            <a
                                key={link.label}
                                href={link.path}
                                target="_blank"
                                className="text-[10px] text-gray-400 transition-colors hover:text-gray-700"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {collapsed && (
                <div className="flex shrink-0 justify-center border-t border-gray-100 py-4">
                    <ProfileAvatar
                        displayName={displayName}
                        initials={userInitials}
                        imageUrl={profileImageUrl}
                        hasImage={hasProfileImage}
                    />
                </div>
            )}
        </>
    );
}

function ProfileAvatar({
    displayName,
    initials,
    imageUrl,
    hasImage,
}: {
    displayName: string;
    initials: string;
    imageUrl: string;
    hasImage: boolean;
}) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-xs font-bold text-white ring-2 ring-green-100">
            {hasImage ? (
                <img
                    src={imageUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.parentElement!.classList.add("bg-gradient-to-br", "from-orange-400", "to-orange-600");
                        event.currentTarget.parentElement!.innerHTML = initials;
                    }}
                />
            ) : (
                initials
            )}
        </div>
    );
}
