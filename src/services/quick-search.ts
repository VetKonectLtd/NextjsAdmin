import apiClient from "@/lib/api-client";

export interface QuickSearchResult {
	to: string;
	from: string;
}

export const quickSearchService = {
	getUsersFrom: async (from: string, to: string) => {
		const response = await apiClient.get(`/v3/admin/filter-new-by-date`, {
			params: { from, to },
		});
		return response.data;
	},
};
