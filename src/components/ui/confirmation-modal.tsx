import { Modal } from "./modal";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    confirmLabel = "Confirm", 
    cancelLabel = "Cancel",
    variant = "danger",
    isLoading = false
}: ConfirmationModalProps) {
    
    const getConfirmButtonClass = () => {
        switch (variant) {
            case "danger":
                return "bg-red-600 hover:bg-red-700 text-white";
            case "warning":
                return "bg-orange-500 hover:bg-orange-600 text-white";
            default:
                return "bg-green-600 hover:bg-green-700 text-white";
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            className="max-w-md"
        >
            <div className="space-y-6">
                <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                </p>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </Button>
                    <Button 
                        onClick={onConfirm}
                        className={getConfirmButtonClass()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
