import { useState } from "react";
import { Search, Loader2, Users, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuickSearchStore } from "@/stores/use-quick-search-store";

const QuickSearch = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [searchedDates, setSearchedDates] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const {
    fetchUsersFromDate,
    loadMoreUsersFromDate,
    users,
    isLoading,
    error,
  } = useQuickSearchStore();

  const handleSearch = async () => {
    if (!startDate || !endDate) return;
    setNameFilter("");
    setSearchedDates({ from: startDate, to: endDate });
    await fetchUsersFromDate(startDate, endDate);
  };

  const page = users?.user;
  const normalizedFilter = nameFilter.trim().toLowerCase();
  const filteredUsers =
    page?.data.filter((user) => {
      const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (
        fullName.includes(normalizedFilter) ||
        (user.name || "").toLowerCase().includes(normalizedFilter)
      );
    }) ?? [];
  const hasMore = Boolean(
    page &&
      (page.next_page_url || page.current_page < page.last_page),
  );

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-3 sm:space-y-6 sm:p-6">
      <header>
        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
          Registered Users Search
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Search users registered within a specific date range.
        </p>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-600">
            From Date
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="h-11"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-gray-600">
            To Date
            <Input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="h-11"
            />
          </label>

          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={isLoading || !startDate || !endDate}
              className="h-11 w-full bg-green-600 text-white hover:bg-green-700"
            >
              {isLoading && !users ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Search Users
            </Button>
          </div>
        </div>
      </section>

      {users && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:p-5">
            <div className="flex flex-col gap-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Search Results</h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Showing {page?.data.length ?? 0} of {page?.total ?? 0} users
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                <span>{page?.total ?? 0} total</span>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                value={nameFilter}
                onChange={(event) => setNameFilter(event.target.value)}
                placeholder="Filter loaded users by name..."
                aria-label="Filter users by name"
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold sm:px-5">
                    ID
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold sm:px-5">
                    Name
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold sm:px-5">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-gray-500">
                      {page?.data.length === 0
                        ? "No users found for this date range."
                        : "No loaded users match that name."}
                    </td>
                  </tr>
                )}

                {filteredUsers.map((user) => {
                  const fullName =
                    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
                    user.name ||
                    "Unnamed user";

                  return (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-3.5 text-gray-500 sm:px-5">
                        {user.id}
                      </td>
                      <td className="max-w-[220px] break-words px-4 py-3.5 font-medium text-gray-900 sm:px-5">
                        {fullName}
                      </td>
                      <td className="break-all px-4 py-3.5 text-gray-600 sm:px-5">
                        {user.email}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="border-t border-gray-100 p-4 text-center sm:p-5">
              <Button
                variant="outline"
                disabled={isLoading}
                onClick={() => {
                  if (searchedDates) {
                    loadMoreUsersFromDate(searchedDates.from, searchedDates.to);
                  }
                }}
                className="w-full border-gray-300 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading users...
                  </>
                ) : (
                  <>
                    Load more users
                    <ChevronDown className="ml-2 h-4 w-4 text-green-600" />
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default QuickSearch;
