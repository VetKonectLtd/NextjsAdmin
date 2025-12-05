import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form-input";
import { Loader2, MapPin, Phone, Mail, Camera, Lock, ArrowLeft, Pencil } from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import PhoneInput from "@/components/ui/phone-input";
import ProfileBanner from "@/assets/profile-banner.svg";
import type { UpdateProfilePayload } from "@/types/auth";
import { toast } from "sonner";

export default function AccountPage() {
    const { user, updateProfile, isLoading, checkAuth } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        location: "",
        countryCode: "NG",
    });
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Fetch profile on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Load user data into form
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone_number: user.phone_number || "",
                location: user.location || "",
                countryCode: "NG",
            });
            if (user.profile_picture_url) {
                setPreviewUrl(user.profile_picture_url);
            }
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePhoneChange = (data: { phone: string; countryCode: string }) => {
        setFormData(prev => ({ 
            ...prev, 
            phone_number: data.phone,
            countryCode: data.countryCode 
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updateData: UpdateProfilePayload = {
                email: formData.email,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                location: formData.location,
            };

            if (profilePicture) {
                updateData.profile_picture = profilePicture;
            }

            if (showPasswordFields && password) {
                if (password !== passwordConfirmation) {
                    toast.error("Passwords do not match");
                    setIsSaving(false);
                    return;
                }
                updateData.password = password;
                updateData.password_confirmation = passwordConfirmation;
            }

            await updateProfile(updateData);
            toast.success("Profile updated successfully");
            setShowPasswordFields(false);
            setPassword("");
            setPasswordConfirmation("");
            setShowEditForm(false);
        } catch {
            toast.error("Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    const displayName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Admin" : "Admin";

    // Check if any changes have been made
    const hasChanges = 
        formData.email !== (user?.email || "") ||
        formData.first_name !== (user?.first_name || "") ||
        formData.last_name !== (user?.last_name || "") ||
        formData.phone_number !== (user?.phone_number || "") ||
        formData.location !== (user?.location || "") ||
        profilePicture !== null ||
        (showPasswordFields && password !== "");

    // Profile Card JSX
    const profileCardContent = (showEditButton: boolean = false) => (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-full">
            {/* Banner */}
            <div className="relative h-32">
                <img 
                    src={ProfileBanner} 
                    alt="Profile Banner" 
                    className="w-full h-full object-cover"
                />
                {/* Profile Picture */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt={displayName} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-semibold">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors shadow-md"
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-8 px-[20%] text-center">
                <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
                <p className="text-sm text-gray-500">Admin</p>

                {/* Info Items */}
                <div className="mt-8 space-y-6">
                    {/* Location */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-[58px] h-[58px] rounded-full border border-gray-200 flex items-center justify-center mb-2"
                            style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }}
                        >
                            <MapPin className="h-5 w-5 text-gray-600" />
                        </div>
                        <p className="font-semibold text-gray-900">Location / Address</p>
                        <p className="text-sm text-gray-500">{user?.location || "Not set"}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-[58px] h-[58px] rounded-full border border-gray-200 flex items-center justify-center mb-2"
                            style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }}
                        >
                            <Phone className="h-5 w-5 text-gray-600" />
                        </div>
                        <p className="font-semibold text-gray-900">Phone Number</p>
                        <p className="text-sm text-gray-500">{user?.phone_number || "Not set"}</p>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-[58px] h-[58px] rounded-full border border-gray-200 flex items-center justify-center mb-2"
                            style={{ boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.08)' }}
                        >
                            <Mail className="h-5 w-5 text-gray-600" />
                        </div>
                        <p className="font-semibold text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">{user?.email || "Not set"}</p>
                    </div>
                </div>

                {/* Edit Button (Mobile Only) */}
                {showEditButton && (
                    <Button 
                        onClick={() => setShowEditForm(true)}
                        className="mt-8 w-[382px] max-w-full h-[56px] bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>
        </div>
    );

    // Edit Form JSX
    const editFormContent = (showBackButton: boolean = false) => (
        <div className="bg-white rounded-2xl shadow-sm p-8 h-full">
            {/* Back Button (Mobile Only) */}
            {showBackButton && (
                <button 
                    onClick={() => setShowEditForm(false)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>
            )}

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Account Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                    You can update your profile information<br />by filling the field below
                </p>
            </div>

            <div className="max-w-[382px] mx-auto space-y-4">
                {/* Email */}
                <FormInput
                    type="email"
                    label="Email Address"
                    focusLabel="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                />

                {/* First Name */}
                <FormInput
                    type="text"
                    label="First Name"
                    focusLabel="First Name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                />

                {/* Last Name */}
                <FormInput
                    type="text"
                    label="Last Name"
                    focusLabel="Last Name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                />

                {/* Phone Number */}
                <PhoneInput
                    label="Phone No"
                    focusLabel="Phone Number"
                    value={formData.phone_number}
                    countryCode={formData.countryCode}
                    onChange={handlePhoneChange}
                />

                {/* Location */}
                <FormInput
                    type="text"
                    label="Location / Address"
                    focusLabel="Location / Address"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                />

                {/* Change Password Button */}
                {!showPasswordFields ? (
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full h-[56px] bg-gray-200 hover:bg-gray-300 text-gray-700"
                        onClick={() => setShowPasswordFields(true)}
                    >
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                    </Button>
                ) : (
                    <div className="space-y-4">
                        <FormInput
                            type="password"
                            label="New Password"
                            focusLabel="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FormInput
                            type="password"
                            label="Confirm Password"
                            focusLabel="Confirm Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-sm text-gray-500"
                            onClick={() => {
                                setShowPasswordFields(false);
                                setPassword("");
                                setPasswordConfirmation("");
                            }}
                        >
                            Cancel password change
                        </Button>
                    </div>
                )}

                {/* Save Button */}
                <Button 
                    onClick={handleSave}
                    disabled={isSaving || !hasChanges}
                    className="w-full h-[56px] bg-green-600 hover:bg-green-700 text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
                {/* Left Side - 2 columns */}
                <div className="lg:col-span-2">
                    {profileCardContent(false)}
                </div>
                {/* Right Side - 3 columns */}
                <div className="lg:col-span-3">
                    {editFormContent(false)}
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden">
                {!showEditForm ? profileCardContent(true) : editFormContent(true)}
            </div>
        </div>
    );
}
