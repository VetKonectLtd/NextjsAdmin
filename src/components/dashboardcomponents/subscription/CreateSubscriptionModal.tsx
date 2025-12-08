import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { Button } from '@/components/ui/button';
import { useSubscriptionStore } from '@/stores/use-subscription-store';
import type { CreateSubscriptionPayload } from '@/types/subscription';
import { Loader2 } from 'lucide-react';

interface CreateSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateSubscriptionModal({ isOpen, onClose }: CreateSubscriptionModalProps) {
    const { createPlan, isLoading } = useSubscriptionStore();
    
    // Initial state with default values
    const [formData, setFormData] = useState<CreateSubscriptionPayload>({
        subscription_title: '',
        subscription_code: '',
        currency: 'NGN',
        price: 0,
        vat: '0%',
        date_option: 'Days',
        duration: 30,
        case_record: 0,
        profile_approval: 'No Approval Badge',
        contact_info: false,
        direct_message: false,
        feed_calculator: false,
        disease_predictor: false,
        store: 0,
        no_of_products: 0,
        customer_support: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
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
            await createPlan(formData);
            onClose();
            // Reset form? maybe later or on next open
        } catch {
            // Error handled by store
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Subscription Plan" className="max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        label="Plan Title"
                        name="subscription_title"
                        value={formData.subscription_title}
                        onChange={handleChange}
                        isRequired
                    />
                    <FormInput
                        label="Plan Code"
                        name="subscription_code"
                        value={formData.subscription_code}
                        onChange={handleChange}
                        isRequired
                    />
                </div>

                {/* Pricing Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormInput
                        label="VAT"
                        name="vat"
                        value={formData.vat || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Duration Section */}
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

                {/* Limits & Quotas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormInput
                        label="Case Records Limit"
                        name="case_record"
                        type="number"
                        value={formData.case_record || 0}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Store Limit"
                        name="store"
                        type="number"
                        value={formData.store || 0}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Products Limit"
                        name="no_of_products"
                        type="number"
                        value={formData.no_of_products || 0}
                        onChange={handleChange}
                    />
                </div>

                {/* Profile Badge */}
                <FormSelect
                    label="Profile Approval Badge"
                    options={[
                        { value: 'No Approval Badge', label: 'No Approval Badge' },
                        { value: 'Approved Badge', label: 'Approved Badge' }
                    ]}
                    value={formData.profile_approval}
                    onChange={(value) => handleSelectChange('profile_approval', value)}
                />

                {/* Features Toggles */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { key: 'contact_info', label: 'Contact Info' },
                            { key: 'direct_message', label: 'Direct Message' },
                            { key: 'feed_calculator', label: 'Feed Calculator' },
                            { key: 'disease_predictor', label: 'Disease Predictor' },
                            { key: 'customer_support', label: 'Customer Support' },
                        ].map((feature) => (
                            <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name={feature.key}
                                    checked={formData[feature.key as keyof CreateSubscriptionPayload] as boolean}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">{feature.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Plan'
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
