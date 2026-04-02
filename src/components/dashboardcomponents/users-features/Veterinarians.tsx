import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, Stethoscope, Eye, Check } from "lucide-react";
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

export function Veterinarians() {
    const [searchQuery, setSearchQuery] = useState("");
    const { veterinarians, fetchVeterinarians, isLoading, error } = useUserStore();

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedVet, setSelectedVet] = useState<any | null>(null);

    const rejectUser = useUserStore((s) => s.rejectUser);

    useEffect(() => {
        fetchVeterinarians();
    }, [fetchVeterinarians]);

    if (isLoading && !veterinarians) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        );
    }

    if (error && !veterinarians) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Failed to load veterinarians
                </h3>
                <p className="mb-4 break-words text-sm text-gray-500">{error}</p>
                <Button
                    onClick={() => fetchVeterinarians()}
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

    const openDetailsModal = (vet: any) => {
        setSelectedVet(vet);
        setDetailsOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedVetId || !rejectReason.trim()) return;

        await rejectUser(selectedVetId, "doctor", rejectReason);
        setRejectModalOpen(false);
        setSelectedVetId(null);
        setRejectReason("");
    };

    const filteredVets =
        veterinarians?.data?.filter((vet) => {
            const searchLower = searchQuery.toLowerCase();
            return (
                vet.user.first_name?.toLowerCase().includes(searchLower) ||
                vet.user.last_name?.toLowerCase().includes(searchLower) ||
                vet.specialty.toLowerCase().includes(searchLower) ||
                vet.address.toLowerCase().includes(searchLower)
            );
        }) || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Search */}
            <div className="px-4 py-4 sm:px-6 sm:py-6">
                <Input
                    type="text"
                    placeholder="Search name, specialty, address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* List */}
            <div className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                {filteredVets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Stethoscope className="mb-4 h-12 w-12 text-gray-300" />
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                            No veterinarians found
                        </h3>
                        <p className="text-sm text-gray-500">
                            {searchQuery
                                ? "Try adjusting your search query"
                                : "Veterinarians will appear here once they register"}
                        </p>
                    </div>
                ) : (
                    filteredVets.map((vet) => (
                        <div
                            key={vet.id}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    {vet.user.profile?.profile_image_url ? (
                                        <img
                                            src={vet.user.profile.profile_image_url}
                                            alt={vet.user.first_name || "Vet"}
                                            className="h-12 w-12 flex-shrink-0 rounded-full border-2 border-green-500 object-cover sm:h-16 sm:w-16"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white sm:h-16 sm:w-16 sm:text-lg">
                                            {(vet.user.first_name?.[0] || "") + (vet.user.last_name?.[0] || "")}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h3 className="break-words font-semibold text-gray-900 underline">
                                            Dr. {vet.user.first_name} {vet.user.last_name}
                                        </h3>
                                        <p className="break-words text-sm text-gray-500">{vet.role}</p>
                                        <p className="break-words text-xs text-gray-400">{vet.specialty}</p>
                                        <p className="break-words text-xs text-gray-400">{vet.list_them}</p>
                                        <p className="break-words text-xs text-gray-400">{vet.address}</p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => openDetailsModal(vet)}
                                        className="h-9 w-9 p-0 sm:h-10 sm:w-10"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="w-full sm:w-auto sm:min-w-[230px]">
                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                        {vet.is_approved === "0" ? (
                                            <Button
                                                className="w-full bg-green-500 text-white hover:bg-green-600 sm:w-auto"
                                                onClick={() => useUserStore.getState().verifyUser(vet.id, "doctor")}
                                            >
                                                Verify
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="w-full cursor-default border-green-600 text-green-600 hover:bg-transparent sm:w-auto"
                                                >
                                                    Verified <Check className="ml-1 size-5" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-600 text-red-600 hover:bg-red-50 sm:w-auto"
                                                    onClick={() => openRejectModal(vet.id)}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}

                                        <div className="w-full sm:w-auto">
                                            <DatePill date={vet.created_at} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Load More */}
            {veterinarians?.next_page_url && (
                <div className="mt-2 flex justify-center px-4 pb-6 sm:px-6">
                    <Button
                        variant="outline"
                        className="w-full border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 sm:w-auto"
                        onClick={() => fetchVeterinarians(veterinarians.current_page + 1)}
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

            {/* Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="w-[95vw] max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Veterinarian Details</DialogTitle>
                        <DialogDescription>Full profile information</DialogDescription>
                    </DialogHeader>

                    {selectedVet && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                {selectedVet.user.profile?.profile_image_url ? (
                                    <img
                                        src={selectedVet.user.profile.profile_image_url}
                                        className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-bold sm:h-20 sm:w-20 sm:text-xl">
                                        {selectedVet.user.first_name?.[0]}
                                        {selectedVet.user.last_name?.[0]}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 text-sm break-words">
                                <p><strong>Name:</strong> Dr. {selectedVet.user.first_name} {selectedVet.user.last_name}</p>
                                <p><strong>Email:</strong> <span className="break-all">{selectedVet.user.email}</span></p>
                                <p><strong>Role:</strong> {selectedVet.role}</p>
                                <p><strong>Specialty:</strong> {selectedVet.specialty}</p>
                                <p><strong>Address:</strong> {selectedVet.address}</p>
                                <p><strong>Status:</strong> {selectedVet.is_approved === "1" ? "Verified" : "Pending"}</p>
                                <p><strong>Practice License Number:</strong> {selectedVet.practice_license_num}</p>
                                <p><strong>Joined:</strong> {selectedVet.created_at}</p>
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

            {/* Reject Modal */}
            <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
                <DialogContent className="w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Reject Veterinarian</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting this veterinarian.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Textarea
                            placeholder="Type rejection reason..."
                            value={rejectReason}
                            onChange={(e: any) => setRejectReason(e.target.value)}
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
