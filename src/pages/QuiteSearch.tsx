import { useQuiteSearchStore } from "@/stores/use-quite-search-store";
import { useState } from "react";

const QuiteSearch = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { fetchUsersFromDate, users, isLoading } = useQuiteSearchStore();

  const handleSearch = async () => {
    if (!startDate || !endDate) return;

    try {
      await fetchUsersFromDate(startDate, endDate);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const userList = (users as any)?.user?.data || [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Registered Users Search
        </h1>
        <p className="text-gray-500 text-sm">
          Search users registered within a specific date range.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white shadow-sm border rounded-xl p-6">
        <div className="grid md:grid-cols-3 gap-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full transition disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search Users"}
            </button>
          </div>

        </div>
      </div>

      {/* Results */}
      <div className="bg-white border rounded-xl shadow-sm">

        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-700">Search Results</h2>

          <span className="text-lg font-bold text-gray-700 flex">
            {(users as any)?.user?.total} <p className="text-gray-500 ml-2 font-normal">users found</p> 
          </span>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
              </tr>
            </thead>

            <tbody>
              {userList.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-400">
                    No users found for this date range
                  </td>
                </tr>
              )}

              {userList.map((user: any) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="p-3">{user.email}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};

export default QuiteSearch;