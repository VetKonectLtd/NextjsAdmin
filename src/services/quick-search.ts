import apiClient from "@/lib/api-client";

export interface QuickSearchResult {
	id: number | string;
	first_name?: string | null;
	last_name?: string | null;
	name?: string | null;
	email: string;
	created_at?: string;
}

export interface QuickSearchPage {
	current_page: number;
	data: QuickSearchResult[];
	last_page: number;
	next_page_url: string | null;
	total: number;
}

export interface QuickSearchResponse {
	user: QuickSearchPage;
}

export const quickSearchService = {
	getUsersFrom: async (from: string, to: string, page = 1) => {
		const response = await apiClient.get<QuickSearchResponse>(`/v3/admin/filter-new-by-date`, {
			params: { from, to, page },
		});
		return response.data;
	},
};
