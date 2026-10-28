import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	ChevronDown,
	Loader2,
	AlertCircle,
	UserCheck,
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
import type { Paraprofessional } from "@/types/users";

const isParaprofessionalApproved = (
	status: Paraprofessional["is_approved"],
) => status === "1" || status === 1 || status === true;

export function Paraprofessionals() {
    const [searchQuery, setSearchQuery] = useState("");
	const [verificationFilter, setVerificationFilter] = useState("all");
    const { paraprofessionals, fetchParaprofessionals, isLoading, error } =
        useUserStore();
    const [stackedParas, setStackedParas] = useState<Paraprofessional[]>([]);

	const [rejectModalOpen, setRejectModalOpen] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
	const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

	const [detailsOpen, setDetailsOpen] = useState(false);
	const [selectedPara, setSelectedPara] = useState<Paraprofessional | null>(null);

	const rejectUser = useUserStore((s) => s.rejectUser);

	useEffect(() => {
		fetchParaprofessionals();
	}, [fetchParaprofessionals]);

	useEffect(() => {
		if (!paraprofessionals?.data) return;

		setStackedParas((prev) => {
			// first page replaces list
			if ((paraprofessionals.current_page ?? 1) <= 1) {
				return paraprofessionals.data;
			}

			// next pages append + de-duplicate by id
			const byId = new Map<number, Paraprofessional>(
				prev.map((para): [number, Paraprofessional] => [para.id, para]),
			);
			for (const para of paraprofessionals.data) {
				byId.set(para.id, para);
			}
			return Array.from(byId.values());
		});
	}, [paraprofessionals]);

	if (isLoading && !paraprofessionals) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 animate-spin text-green-500" />
			</div>
		);
	}

	if (error && !paraprofessionals) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
				<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
				<h3 className="text-lg font-semibold text-gray-900 mb-2">
					Failed to load paraprofessionals
				</h3>
				<p className="text-sm text-gray-500 mb-4">{error}</p>
				<Button
					onClick={() => fetchParaprofessionals()}
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

	const openDetailsModal = (para: Paraprofessional) => {
		setSelectedPara(para);
		setDetailsOpen(true);
	};

	const handleRejectConfirm = async () => {
		if (!selectedVetId || !rejectReason.trim()) return;

		await rejectUser(selectedVetId, "paraprofessional", rejectReason);

		setRejectModalOpen(false);
		setSelectedVetId(null);
		setRejectReason("");
	};

	const filteredParas =
		stackedParas.filter((para) => {
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				para.user.first_name?.toLowerCase().includes(searchLower) ||
				para.user.last_name?.toLowerCase().includes(searchLower) ||
				para.specialty.toLowerCase().includes(searchLower) ||
				para.name_of_institution.toLowerCase().includes(searchLower);
			const isVerified = isParaprofessionalApproved(para.is_approved);
			const matchesVerification =
				verificationFilter === "all" ||
				(verificationFilter === "verified" && isVerified) ||
				(verificationFilter === "unverified" && !isVerified);

			return matchesSearch && matchesVerification;
		}) || [];

	return (
		<div className="min-h-screen bg-white">
			{/* Search and Filter Section */}
			<div className="flex flex-col gap-3 px-3 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-6">
				<Input
					type="text"
					placeholder="Search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="flex-1"
				/>
				<Select
					value={verificationFilter}
					onValueChange={setVerificationFilter}
				>
					<SelectTrigger
						aria-label="Filter paraprofessionals by verification status"
						className="w-full sm:w-56"
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All paraprofessionals</SelectItem>
						<SelectItem value="verified">Verified</SelectItem>
						<SelectItem value="unverified">Unverified</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* List */}
			<div className="space-y-3 px-3 pb-4 sm:space-y-4 sm:px-6">
				{filteredParas.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<UserCheck className="h-12 w-12 text-gray-300 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No paraprofessionals found
						</h3>
						<p className="text-sm text-gray-500">
							{searchQuery || verificationFilter !== "all"
								? "Try adjusting your search or filter"
								: "Paraprofessionals will appear here once they register"}
						</p>
					</div>
				) : (
					filteredParas.map((para) => (
						<div
							key={para.id}
							className="flex flex-col items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4 sm:p-4"
						>
							{/* Avatar */}
							{para.user.profile?.profile_image_url ? (
								<img
									src={para.user.profile.profile_image_url}
									alt={para.user.first_name || "Para"}
									className="h-12 w-12 shrink-0 rounded-full border-2 border-green-500 object-cover sm:h-16 sm:w-16"
								/>
							) : (
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-green-500 bg-gradient-to-br from-blue-400 to-blue-600 text-sm font-semibold text-white sm:h-16 sm:w-16 sm:text-lg">
									{(para.user.first_name?.[0] || "") +
										(para.user.last_name?.[0] || "")}
								</div>
							)}

							{/* Info */}
							<div className="min-w-0 flex-1">
								<h3 className="break-words font-semibold text-gray-900 underline">
									{para.user.first_name} {para.user.last_name}
								</h3>
								<p className="text-sm text-gray-500">{para.role}</p>
								<p className="text-xs text-gray-400">{para.specialty}</p>
								<p className="text-xs text-gray-400">
									{para.name_of_institution}
								</p>
								<p className="text-xs text-gray-400">{para.contact_num}</p>
								<p className="break-words text-xs text-gray-400">{para.address}</p>
							</div>

							{/* Action Buttons */}
							<Button variant="outline" onClick={() => openDetailsModal(para)} className="shrink-0 self-end min-[420px]:self-auto">
								<Eye className="h-6 w-6" />
							</Button>
							<Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
								<DialogContent className="max-w-lg">
									<DialogHeader>
										<DialogTitle>Paraprofessional Details</DialogTitle>
										<DialogDescription>
											Full paraprofessional profile information
										</DialogDescription>
									</DialogHeader>

									{selectedPara && (
										<div className="space-y-4">
											<div className="flex items-center gap-4">
												{selectedPara.user.profile?.profile_image_url ? (
													<img
														src={selectedPara.user.profile.profile_image_url}
														className="w-20 h-20 rounded-full object-cover"
													/>
												) : (
													<div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold">
														{selectedPara.user.first_name?.[0]}
														{selectedPara.user.last_name?.[0]}
													</div>
												)}
											</div>

											<div className="text-sm space-y-2">
												<p>
													<strong>Name:</strong> {selectedPara.user.first_name}{" "}
													{selectedPara.user.last_name}
												</p>
												<p>
													<strong>Email:</strong> {selectedPara.user.email}
												</p>
												<p>
													<strong>Role:</strong> {selectedPara.role}
												</p>
												<p>
													<strong>Specialty:</strong> {selectedPara.specialty}
												</p>
												<p>
													<strong>Institution:</strong>{" "}
													{selectedPara.name_of_institution}
												</p>
												<p>
													<strong>Contact:</strong> {selectedPara.contact_num}
												</p>
												<p>
													<strong>Address:</strong> {selectedPara.address}
												</p>
												<p>
													<strong>Status:</strong>{" "}
													{isParaprofessionalApproved(selectedPara.is_approved)
														? "Verified"
														: "Pending"}
												</p>
												<p>
													<strong>Joined:</strong> {selectedPara.created_at}
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

							<div className="flex w-full flex-wrap items-center gap-2 min-[420px]:w-auto sm:gap-3">
								{isParaprofessionalApproved(para.is_approved) ? (
									<Button
										variant="outline"
										className="text-green-600 border-green-600 cursor-default hover:bg-transparent"
									>
										Verified
										<Check className="ml-1 font-extrabold size-6" />
									</Button>
								) : (
									<Button
										className="bg-green-500 hover:bg-green-600 text-white"
										onClick={() =>
											useUserStore
												.getState()
												.verifyUser(para.id, "paraprofessional")
										}
									>
										Verify
									</Button>
								)}

								<Button
									variant="outline"
									className="text-red-600 border-red-600 hover:bg-red-50"
									onClick={() => openRejectModal(para.id)}
								>
									Reject
								</Button>

								<DatePill date={para.created_at} />
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
											onChange={(e) => setRejectReason(e.target.value)}
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
			{paraprofessionals?.next_page_url && (
				<div className="mt-6 flex justify-center pb-6">
					<Button
						variant="outline"
						className="bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
						onClick={() =>
							fetchParaprofessionals(paraprofessionals.current_page + 1)
						}
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
