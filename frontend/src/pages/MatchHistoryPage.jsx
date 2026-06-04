import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMatchHistory, updateMatchStatus } from "../api/matchApi";
import Badge from "../components/ui/Badge";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import StatCard from "../components/ui/StatCard";
import Pagination from "../components/customers/Pagination";
import { formatDate, fullName } from "../utils/formatters";

const MatchHistoryPage = () => {
  const [filters, setFilters] = useState({ search: "", status: "sent", page: 1, limit: 10 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchMatchHistory(filters);
      setData(response);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load match history");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const changeStatus = async (matchId, status) => {
    setUpdatingId(matchId);
    try {
      await updateMatchStatus(matchId, {
        status,
        note: `Marked ${status} from match history`
      });
      await loadHistory();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update match status");
    } finally {
      setUpdatingId("");
    }
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Match History</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">Sent matches and outcomes</h2>
      </div>

      {data ? (
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Sent" value={data.stats.sent || 0} helper="Introductions sent" />
          <StatCard label="Accepted" value={data.stats.accepted || 0} helper="Positive responses" />
          <StatCard label="Declined" value={data.stats.declined || 0} helper="Closed recommendations" />
        </section>
      ) : null}

      <section className="card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_14rem]">
          <input
            className="field"
            placeholder="Search customer or matched profile"
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
          />
          <select className="field" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">All statuses</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingState label="Loading match history" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadHistory} />
      ) : data.matches.length ? (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Matched Profile</th>
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Score</th>
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Sent At</th>
                    <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.matches.map((match) => (
                    <tr key={match._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <Link to={`/customers/${match.customer?._id}`} className="font-semibold text-slate-950 hover:underline">
                          {fullName(match.customer)}
                        </Link>
                        <p className="text-sm text-slate-500">{match.customer?.city}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Link to={`/customers/${match.matchedCustomer?._id}`} className="font-semibold text-slate-950 hover:underline">
                          {fullName(match.matchedCustomer)}
                        </Link>
                        <p className="text-sm text-slate-500">{match.matchedCustomer?.city}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-950">{match.score}%</td>
                      <td className="px-5 py-4">
                        <Badge tone="default">{match.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{formatDate(match.sentAt || match.updatedAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled={updatingId === match._id || match.status === "accepted"}
                            onClick={() => changeStatus(match._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled={updatingId === match._id || match.status === "declined"}
                            onClick={() => changeStatus(match._id, "declined")}
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            pagination={data.pagination}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
          />
        </>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No match history found.</p>
        </div>
      )}
    </div>
  );
};

export default MatchHistoryPage;
