import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { Button } from '@/components/ui/button';
import { useSubscriptionStore } from '@/stores/use-subscription-store';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface CreateSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingPlan?: any | null;
}

interface CreateSubscriptionPayload {
    subscription_title: string;
    currency: string;
    price: number;
    date_option: 'Days' | 'Months';
    duration: string;
    features: string[];
}

export function CreateSubscriptionModal({ isOpen, onClose, editingPlan }: CreateSubscriptionModalProps) {
    const { createPlan, isLoading, updatePlan, fetchPlans } = useSubscriptionStore();

    // Initial state with simplified structure
    const initialFormData: CreateSubscriptionPayload = {
        subscription_title: '',
        currency: 'NGN',
        price: 0,
        date_option: "Months",
        duration: '30',
        features: [],
    };

    const [formData, setFormData] = useState<CreateSubscriptionPayload>(initialFormData);

    useEffect(() => {
        if (editingPlan) {
            setFormData({
                subscription_title: editingPlan.subscription_title,
                currency: editingPlan.currency,
                price: editingPlan.price,
                date_option: editingPlan.date_option,
                duration: editingPlan.duration,
                features: editingPlan.features || [],
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editingPlan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const handleAddFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, '']
        }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => (i === index ? value : feature))
        }));
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingPlan) {
                await updatePlan(editingPlan.id, formData);
            } else {
                await createPlan(formData);
            }

            setFormData(initialFormData);
            await fetchPlans();
            onClose();
        } catch {
            // handled by store
        }
    };



    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title={editingPlan ? "Update Subscription Plan" : "Create Subscription Plan"}
            className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <FormInput
                    label="Plan Title"
                    name="subscription_title"
                    value={formData.subscription_title}
                    onChange={handleChange}
                    isRequired
                />

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        isRequired
                    />
                    <FormInput
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        isRequired
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
                            { value: 'Months', label: 'Months' },
                            { value: 'years', label: 'Years' }
                        ]}
                        value={formData.date_option}
                        onChange={(value) => handleSelectChange('date_option', value)}
                    />
                    <FormInput
                        label="Duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        isRequired
                        min={1}
                    />
                </div>

                {/* Features */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Features</label>
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Feature
                        </button>
                    </div>

                    {formData.features.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No features added yet. Click "Add Feature" to get started.</p>
                    ) : (
                        <div className="space-y-2">
                            {formData.features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Feature ${index + 1}`}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFeature(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="Remove feature"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {editingPlan ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            editingPlan ? "Update Plan" : "Create Plan"
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

