import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ChevronDown,
    Loader2,
    AlertCircle,
    Building2,
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

export function Clinic() {
    const [searchQuery, setSearchQuery] = useState("");
    const { listedClinics, fetchListedClinics, isLoading, error } = useUserStore();

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedClinic, setSelectedClinic] = useState<any | null>(null);

    const rejectUser = useUserStore((s) => s.rejectUser);

    useEffect(() => {
        fetchListedClinics();
    }, [fetchListedClinics]);

    if (isLoading && !listedClinics) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !listedClinics) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load clinics
                </h3>
                <p className="text-sm text-gray-500 mb-4">{error}</p>
                <Button
                    onClick={() => fetchListedClinics()}
                    className="bg-green-500 hover:bg-green-600 text-white"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    const openRejectModal = (clinicId: number) => {
        setSelectedClinicId(clinicId);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const openDetailsModal = (clinic: any) => {
        setSelectedClinic(clinic);
        setDetailsOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedClinicId || !rejectReason.trim()) return;

        await rejectUser(selectedClinicId, "clinic", rejectReason);

        setRejectModalOpen(false);
        setSelectedClinicId(null);
        setRejectReason("");
    };

    const filteredClinics =
        listedClinics?.data?.filter((clinic:any) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                clinic.clinic_name?.toLowerCase().includes(searchLower) ||
                clinic.clinic_speciality?.toLowerCase().includes(searchLower) ||
                clinic.location?.toLowerCase().includes(searchLower)
            );
        }) || [];


    return (
        <div className="min-h-screen bg-white">
            {/* Search Section */}
            <div className="px-6 py-6 flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                />
            </div>

            {/* Clinic List */}
            <div className="px-6 space-y-4">
                {filteredClinics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No clinics found
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search query"
                                : "Clinics will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredClinics.map((clinic:any) => (
                        <div
                            key={clinic.id}
                            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
                        >
                            {/* Avatar */}
                            {clinic.picture ? (
                                <img
                                    src={clinic.picture_url}
                                    alt={clinic.clinic_name || "Clinic"}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {clinic.clinic_name?.[0] || "C"}
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {clinic.clinic_name}
                                </h3>
                                <p className="text-sm text-gray-500">{clinic.clinic_speciality}</p>
                                <p className="text-xs text-gray-400">{clinic.phone_number}</p>
                                <p className="text-xs text-gray-400">{clinic.location}</p>
                                <p className="text-xs text-gray-400">{clinic.email}</p>
                            </div>

                            {/* View Details Button */}
                            <Button
                                variant="outline"
                                onClick={() => openDetailsModal(clinic)}
                            >
                                <Eye className="h-6 w-6" />
                            </Button>

                            {/* Details Modal */}
                            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                                <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Clinic Details</DialogTitle>
                                        <DialogDescription>
                                            Full clinic information
                                        </DialogDescription>
                                    </DialogHeader>

                                    {selectedClinic && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                {selectedClinic.picture ? (
                                                    <img
                                                        src={selectedClinic.picture_url}
                                                        className="w-20 h-20 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
                                                        {selectedClinic.clinic_name?.[0]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-sm space-y-2">
                                                <p>
                                                    <strong>Clinic Name:</strong>{" "}
                                                    {selectedClinic.clinic_name}
                                                </p>
                                                <p>
                                                    <strong>Email:</strong> {selectedClinic.email}
                                                </p>
                                                <p>
                                                    <strong>Speciality:</strong>{" "}
                                                    {selectedClinic.clinic_speciality}
                                                </p>
                                                <p>
                                                    <strong>Phone:</strong> {selectedClinic.phone_number}
                                                </p>
                                                <p>
                                                    <strong>Location:</strong> {selectedClinic.location}
                                                </p>
                                                <p>
                                                    <strong>Status:</strong>{" "}
                                                    {selectedClinic.is_approved === "1"
                                                        ? "Verified"
                                                        : "Pending"}
                                                </p>
                                                <p>
                                                    <strong>Joined:</strong> {selectedClinic.created_at}
                                                </p>
                                            </div>

                                            <div className="flex justify-end gap-3">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setDetailsOpen(false)}
                                                >
                                                    Close
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* Verify / Reject Actions */}
                            <div className="flex items-center gap-3">
                                {clinic.is_approved === "0" ? (
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() =>
                                            useUserStore
                                                .getState()
                                                .verifyUser(clinic.id, "clinic")
                                        }
                                    >
                                        Verify
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="text-green-600 border-green-600 cursor-default hover:bg-transparent"
                                        >
                                            Verified
                                            <Check className="ml-1 font-extrabold size-6" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-red-600 border-red-600 hover:bg-red-50"
                                            onClick={() => openRejectModal(clinic.id)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                <DatePill date={clinic.created_at} />
                            </div>

                            {/* Reject Modal */}
                            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-red-600">
                                            Reject Clinic
                                        </DialogTitle>
                                        <DialogDescription>
                                            Please provide a reason for rejecting this clinic.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <Textarea
                                            placeholder="Type rejection reason..."
                                            value={rejectReason}
                                            onChange={(e: any) => setRejectReason(e.target.value)}
                                            rows={4}
                                        />

                                        <div className="flex justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() => setRejectModalOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                className="bg-red-600 hover:bg-red-700 text-white"
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
                    ))
                )}
            </div>

            {/* Load More */}
            {listedClinics?.next_page_url && (
                <div className="mt-6 flex justify-center pb-6">
                    <Button
                        variant="outline"
                        className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
                        onClick={() => fetchListedClinics(listedClinics.current_page + 1)}
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
                                <ChevronDown className="h-4 w-4 ml-2 text-green-500" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}