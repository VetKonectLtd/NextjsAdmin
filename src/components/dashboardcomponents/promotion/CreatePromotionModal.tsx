import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { Button } from '@/components/ui/button';
import { usePromotionStore } from '@/stores/use-promotion-store';
import type { CreatePromotionPayload, PromotionPlan } from '@/types/promotion';
import { Loader2 } from 'lucide-react';


interface CreatePromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingPlan?: PromotionPlan | null;
}

export function CreatePromotionModal({ isOpen, onClose, editingPlan }: CreatePromotionModalProps) {
    const { createPromotion, updatePromotion, isLoading } = usePromotionStore();
    
    // Initial state with default values
    const [formData, setFormData] = useState<CreatePromotionPayload>({
        title: '',
        currency: 'USD',
        price: 0,
        vat: 0,
        date_option: 'Days',
        duration: 7,
        no_of_products: 1,
        status: 'active',
    });

    // Populate form when editing
    useEffect(() => {
        if (editingPlan && isOpen) {
            setFormData({
                title: editingPlan.title,
                currency: editingPlan.currency,
                price: parseFloat(editingPlan.price),
                vat: parseFloat(String(editingPlan.vat)),
                date_option: editingPlan.date_option,
                duration: editingPlan.duration,
                no_of_products: parseInt(String(editingPlan.no_of_products)),
                status: editingPlan.status,
            });
        } else if (!editingPlan && isOpen) {
            // Reset to defaults when creating
            setFormData({
                title: '',
                currency: 'USD',
                price: 0,
                vat: 0,
                date_option: 'Days',
                duration: 7,
                no_of_products: 1,
                status: 'active',
            });
        }
    }, [editingPlan, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                await updatePromotion(editingPlan.id, formData);
            } else {
                await createPromotion(formData);
            }
            onClose();
        } catch {
            // Error handled by store
        }
    };

    const isEditMode = !!editingPlan;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Promotion Plan" : "Create Promotion Plan"} className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Plan Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        isRequired
                    />
                    <FormInput
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        isRequired
                    />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        isRequired
                        min={0}
                    />
                    <FormInput
                        label="VAT"
                        name="vat"
                        type="number"
                        value={formData.vat || ''}
                        onChange={handleChange}
                        min={0}
                    />
                </div>

                {/* Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        label="Date Option"
                        isRequired
                        options={[
                            { value: 'Days', label: 'Days' },
                            { value: 'Months', label: 'Months' }
                        ]}
                        value={formData.date_option}
                        onChange={(value) => handleSelectChange('date_option', value)}
                    />
                    <FormInput
                        label="Duration"
                        name="duration"
                        type="number"
                        value={formData.duration}
                        onChange={handleChange}
                        isRequired
                        min={1}
                    />
                </div>

                {/* Other Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Number of Products"
                        name="no_of_products"
                        type="number"
                        value={formData.no_of_products}
                        onChange={handleChange}
                        isRequired
                        min={1}
                    />
                    <FormSelect
                        label="Status"
                        isRequired
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' }
                        ]}
                        value={formData.status}
                        onChange={(value) => handleSelectChange('status', value as 'active' | 'inactive')}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </>
                        ) : (
                            isEditMode ? 'Update Plan' : 'Create Plan'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
