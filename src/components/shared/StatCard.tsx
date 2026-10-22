import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    highlighted?: boolean;
    className?: string;
}

export function StatCard({
    icon,
    label,
    value,
    highlighted = false,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4",
                highlighted
                    ? "border-green-500 shadow-md"
                    : "border-gray-200",
                className
            )}
        >
            <div
                className={cn(
                    "h-8 w-8 mb-2 flex items-center justify-center",
                    highlighted ? "text-green-500" : "text-gray-600"
                )}
            >
                {icon}
            </div>
            <p className="mb-1 text-center text-xs leading-tight text-gray-600">{label}</p>
            <p
                className={cn(
                    "text-xl font-bold",
                    highlighted ? "text-green-500" : "text-gray-900"
                )}
            >
                {value}
            </p>
        </div>
    );
}
