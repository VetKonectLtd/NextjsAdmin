import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Loader2, AlertCircle, Stethoscope, Eye } from "lucide-react";
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
	const { veterinarians, fetchVeterinarians, isLoading, error } =
		useUserStore();

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
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-green-500" />
			</div>
		);
	}

	if (error && !veterinarians) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
				<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Failed to load veterinarians
				</h3>
				<p className="text-sm text-gray-500 mb-4">{error}</p>
				<Button
					onClick={() => fetchVeterinarians()}
					className="bg-green-500 hover:bg-green-600 text-white"
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
			{/* Search and Filter Section */}
			<div className="px-6 py-6 flex items-center gap-4">
				<Input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1"
				/>
			</div>

			{/* Veterinarian List */}
			<div className="px-6 space-y-4">
				{filteredVets.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<Stethoscope className="h-12 w-12 text-gray-300 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
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
							className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
						>
							{/* Avatar */}
							{vet.user.profile?.profile_image_url ? (
								<img
									src={vet.user.profile.profile_image_url}
									alt={vet.user.first_name || "Vet"}
									className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
								/>
							) : (
								<div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-green-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
									{(vet.user.first_name?.[0] || "") +
										(vet.user.last_name?.[0] || "")}
								</div>
							)}

							{/* Info */}
							<div className="flex-1">
								<h3 className="font-semibold text-gray-900 underline">
									Dr. {vet.user.first_name} {vet.user.last_name}
								</h3>
								<p className="text-sm text-gray-500">{vet.role}</p>
								<p className="text-xs text-gray-400">{vet.specialty}</p>
								<p className="text-xs text-gray-400">{vet.list_them}</p>
								<p className="text-xs text-gray-400">{vet.address}</p>
							</div>

							{/* Action Buttons */}
							<Button variant="outline" onClick={() => openDetailsModal(vet)}>
								<Eye className="h-6 w-6" />
							</Button>

							<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
								<DialogContent className="max-w-lg">
									<DialogHeader>
										<DialogTitle>Veterinarian Details</DialogTitle>
										<DialogDescription>
											Full profile information
										</DialogDescription>
									</DialogHeader>

									{selectedVet && (
										<div className="space-y-4">
											<div className="flex items-center gap-4">
												{selectedVet.user.profile?.profile_image_url ? (
													<img
														src={selectedVet.user.profile.profile_image_url}
														className="w-20 h-20 rounded-full object-cover"
													/>
												) : (
													<div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
														{selectedVet.user.first_name?.[0]}
														{selectedVet.user.last_name?.[0]}
													</div>
												)}
											</div>

											<div className="text-sm space-y-2">
												<p>
													<strong>Name:</strong> Dr.{" "}
													{selectedVet.user.first_name}{" "}
													{selectedVet.user.last_name}
												</p>
												<p>
													<strong>Email:</strong> {selectedVet.user.email}
												</p>
												<p>
													<strong>Role:</strong> {selectedVet.role}
												</p>
												<p>
													<strong>Specialty:</strong> {selectedVet.specialty}
												</p>
												<p>
													<strong>Address:</strong> {selectedVet.address}
												</p>
												<p>
													<strong>Status:</strong>{" "}
													{selectedVet.is_approved === "1"
														? "Verified"
														: "Pending"}
												</p>
                                                <p><strong>Practice License Number:</strong> {selectedVet.practice_license_num}</p>
												<p>
													<strong>Joined:</strong> {selectedVet.created_at}
												</p>
											</div>

											<div className="flex justify-end">
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

							<div className="flex items-center gap-3">
								{vet.is_approved === "0" ? (
									<>
										<Button
											className="bg-green-500 hover:bg-green-600 text-white"
											onClick={() =>
												useUserStore.getState().verifyUser(vet.id, "doctor")
											}
										>
											Verify
										</Button>

										<Button
											variant="outline"
											className="text-red-600 border-red-600 hover:bg-red-50"
											onClick={() => openRejectModal(vet.id)}
										>
											Reject
										</Button>
									</>
								) : (
									<>
										<Button
											variant="outline"
											className="text-green-600 border-green-600 cursor-default hover:bg-transparent"
										>
											Verified
										</Button>
										<Button
											variant="outline"
											className="text-red-600 border-red-600 hover:bg-red-50"
											onClick={() => openRejectModal(vet.id)}
										>
											Reject
										</Button>
									</>
								)}

								<DatePill date={vet.created_at} />
							</div>
							<Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
								<DialogContent className="max-w-md">
									<DialogHeader>
										<DialogTitle className="text-red-600">
											Reject Veterinarian
										</DialogTitle>
										<DialogDescription>
											Please provide a reason for rejecting this veterinarian.
											This action cannot be undone.
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

			{/* Load More Button */}
			{veterinarians?.next_page_url && (
				<div className="mt-6 flex justify-center pb-6">
					<Button
						variant="outline"
						className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
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
								<ChevronDown className="h-4 w-4 ml-2 text-green-500" />
							</>
						)}
					</Button>
				</div>
			)}
		</div>
	);
}
