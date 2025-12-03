import PlusIcon from "@/assets/icons/plusIcon.svg?react";

interface ManageButtonProps {
    label: string;
    onClick?: () => void;
}

export function ManageButton({ label, onClick }: ManageButtonProps) {
    return (
        <div className="px-6 py-4">
            <button
                onClick={onClick}
                className="w-full bg-white border-2 border-green-500 rounded-lg px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-gray-900">{label}</span>
                <div className="scale-[1.8]">
                    <PlusIcon />
                </div>
            </button>
        </div>
    );
}

