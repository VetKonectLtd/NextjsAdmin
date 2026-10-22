import PlusIcon from "@/assets/icons/plusIcon.svg?react";

interface ManageButtonProps {
    label: string;
    classes?: string;
    onClick?: () => void;
}

export function ManageButton({ label, onClick, classes }: ManageButtonProps) {
    return (
        <div className={`py-3 sm:py-4 ${classes}`}>
            <button
                onClick={onClick}
                className="flex w-full items-center justify-between gap-3 rounded-lg border-2 border-green-500 bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50 sm:px-6 sm:py-4"
            >
                <span className="font-bold text-gray-900">{label}</span>
                <div className="ml-2 shrink-0 scale-150 sm:scale-[1.8]">
                    <PlusIcon />
                </div>
            </button>
        </div>
    );
}
