import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ChevronDown,
    Loader2,
    AlertCircle,
    Eye,
    Check,
} from "lucide-react";
import { useUserStore } from "@/stores/use-user-store";
import { DatePill } from "@/components/ui/date-pill";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Clinic } from "@/types/users";

const isClinicApproved = (status: Clinic["is_approved"]) =>
    status === "1" || status === 1 || status === true;

export function VeterinaryClinic() {
    const [searchQuery, setSearchQuery] = useState("");
    const [verificationFilter, setVerificationFilter] = useState("all");
    const { clinics, fetchClinics, isLoading, error } = useUserStore();
    const [stackedClinics, setStackedClinics] = useState<Clinic[]>([]);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

    const rejectUser = useUserStore((s) => s.rejectUser);

    useEffect(() => {
        fetchClinics();
    }, [fetchClinics]);

    useEffect(() => {
        if (!clinics?.data) return;

        setStackedClinics((prev) => {
            // first page replaces list
            if ((clinics.current_page ?? 1) <= 1) {
                return clinics.data;
            }

            // next pages append + de-duplicate by id
            const byId = new Map<number, Clinic>(
                prev.map((clinic): [number, Clinic] => [clinic.id, clinic]),
            );
            for (const clinic of clinics.data) {
                byId.set(clinic.id, clinic);
            }
            return Array.from(byId.values());
        });
    }, [clinics]);

    if (isLoading && !clinics) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !clinics) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Failed to load veterinary clinics
                </h3>
                <p className="mb-4 break-words text-sm text-gray-500">{error}</p>
                <Button
                    onClick={() => fetchClinics()}
                    className="bg-green-500 text-white hover:bg-green-600"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    const openRejectModal = (vetId: number) => {
        setSelectedVetId(vetId);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const openDetailsModal = (clinic: Clinic) => {
        setSelectedClinic(clinic);
        setDetailsOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedVetId || !rejectReason.trim()) return;

        await rejectUser(selectedVetId, "veterinary-clinic", rejectReason);
        setRejectModalOpen(false);
        setSelectedVetId(null);
        setRejectReason("");
    };

    const filteredClinics =
        stackedClinics.filter((clinic) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                clinic.name_of_clinic.toLowerCase().includes(searchLower) ||
                clinic.specialty.toLowerCase().includes(searchLower) ||
                clinic.address.toLowerCase().includes(searchLower);
            const isVerified = isClinicApproved(clinic.is_approved);
            const matchesVerification =
                verificationFilter === "all" ||
                (verificationFilter === "verified" && isVerified) ||
                (verificationFilter === "unverified" && !isVerified);

            return matchesSearch && matchesVerification;
        }) || [];

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-6">
                <Input
                    type="text"
                    placeholder="Search clinic, specialty, address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full flex-1 text-sm sm:text-base"
                />
                <Select
                    value={verificationFilter}
                    onValueChange={setVerificationFilter}
                >
                    <SelectTrigger
                        aria-label="Filter veterinary clinics by verification status"
                        className="w-full sm:w-56"
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All veterinary clinics</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="mx-auto w-full max-w-6xl space-y-3 px-3 pb-4 sm:space-y-4 sm:px-6 sm:pb-6">
                {filteredClinics.length === 0 ? (
                    <div className="py-16 text-center">
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            No veterinary clinics found
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery || verificationFilter !== "all"
                                ? "Try adjusting your search or filter"
                                : "Veterinary clinics will appear here once they register"}
                        </p>
                    </div>
                ) : filteredClinics.map((clinic) => (
                    <div
                        key={clinic.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white p-3 sm:p-4"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                {clinic.user.profile?.profile_image_url ? (
                                    <img
                                        src={clinic.user.profile.profile_image_url}
                                        alt={clinic.name_of_clinic || "Clinic"}
                                        className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-green-500 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white">
                                        {clinic.name_of_clinic?.[0] || "C"}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <h3 className="break-words font-semibold text-gray-900">
                                        {clinic.name_of_clinic}
                                    </h3>
                                    <p className="break-words text-sm text-gray-500">
                                        {clinic.specialty}
                                    </p>
                                    <p className="break-all text-xs text-gray-400">
                                        {clinic.contact_num}
                                    </p>
                                    <p className="break-words text-xs text-gray-400">
                                        {clinic.address}
                                    </p>
                                    <p className="break-all text-xs text-gray-400">
                                        {clinic.user.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[250px] sm:items-end">
                                <div className="flex w-full flex-wrap items-center gap-2 sm:justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => openDetailsModal(clinic)}
                                        className="w-full sm:w-auto"
                                    >
                                        <Eye className="mr-1 h-4 w-4" />
                                        Details
                                    </Button>

                                    {isClinicApproved(clinic.is_approved) ? (
                                        <Button
                                            variant="outline"
                                            className="w-full cursor-default border-green-600 text-green-600 hover:bg-transparent sm:w-auto"
                                        >
                                            Verified
                                            <Check className="ml-1 size-5" />
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-auto"
                                            onClick={() =>
                                                useUserStore
                                                    .getState()
                                                    .verifyUser(clinic.id, "veterinary-clinic")
                                            }
                                        >
                                            Verify
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="w-full border-red-600 text-red-600 hover:bg-red-50 sm:w-auto"
                                        onClick={() => openRejectModal(clinic.id)}
                                    >
                                        Reject
                                    </Button>
                                </div>

                                <div className="w-full sm:w-auto">
                                    <DatePill date={clinic.created_at} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {clinics?.next_page_url && (
                <div className="mt-2 flex justify-center px-4 pb-6 sm:px-6">
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 sm:w-auto"
                        onClick={() => fetchClinics(clinics.current_page + 1)}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                Loading more...
                                <ChevronDown className="ml-2 h-4 w-4 text-green-500" />
                            </>
                        )}
                    </Button>
                </div>
            )}

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] overflow-y-auto p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle>Clinic Details</DialogTitle>
                        <DialogDescription>
                            Full veterinary clinic information
                        </DialogDescription>
                    </DialogHeader>

                    {selectedClinic && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                {selectedClinic.user.profile?.profile_image_url ? (
                                    <img
                                        src={selectedClinic.user.profile.profile_image_url}
                                        className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold sm:h-20 sm:w-20 sm:text-xl">
                                        {selectedClinic.name_of_clinic?.[0]}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 text-sm break-words">
                                <p><strong>Clinic Name:</strong> {selectedClinic.name_of_clinic}</p>
                                <p><strong>Email:</strong> <span className="break-all">{selectedClinic.user.email}</span></p>
                                <p><strong>Specialty:</strong> {selectedClinic.specialty}</p>
                                <p><strong>Contact:</strong> {selectedClinic.contact_num}</p>
                                <p><strong>Address:</strong> {selectedClinic.address}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    {isClinicApproved(selectedClinic.is_approved)
                                        ? "Verified"
                                        : "Pending"}
                                </p>
                                <p><strong>Joined:</strong> {selectedClinic.created_at}</p>
                            </div>

                            <div className="flex justify-end">
                                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="w-[95vw] max-w-md p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">
                            Reject Veterinary Clinic
                        </DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this veterinary clinic.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type rejection reason..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows={4}
                        />

                        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 text-white hover:bg-red-700"
                                disabled={!rejectReason.trim()}
                                onClick={handleRejectConfirm}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
