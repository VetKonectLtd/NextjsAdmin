import { ReactNode } from "react";
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
                "bg-white rounded-md border-2 p-4 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow",
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
            <p className="text-xs text-gray-600 text-center mb-1">{label}</p>
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

