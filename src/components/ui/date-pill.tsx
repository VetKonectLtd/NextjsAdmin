
import { cn } from "@/lib/utils";

interface DatePillProps {
  date: string;
  className?: string;
}

export function DatePill({ date, className }: DatePillProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center w-[123px] h-[40px] rounded-[100px] border-[0.7px] border-[#1D2432] bg-[#F1F1F1] text-xs text-[#1D2432]",
        className
      )}
    >
      {new Date(date).toLocaleDateString()}
    </span>
  );
}
