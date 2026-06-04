import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCustomerMatches } from "../api/customerApi";
import MatchCard from "../components/matches/MatchCard";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { fullName } from "../utils/formatters";

const MatchRecommendationsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ minScore: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCustomerMatches(id, filters);
      setData(response);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load matches");
    } finally {
      setLoading(false);
    }
  }, [id, filters]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  if (loading) return <LoadingState label="Calculating top matches" />;
  if (error) return <ErrorState message={error} onRetry={loadMatches} />;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Match Recommendations</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-950">Top matches for {fullName(data.customer)}</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ranked by age, height, income, children preference, religion, language, location, relocation, and pets.
          </p>
        </div>
        <Link to={`/customers/${data.customer._id}`} className="btn-secondary">
          Profile Details
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Profiles Evaluated</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.summary?.totalProfilesEvaluated || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Eligible Matches</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.summary?.totalMatchingProfiles || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Compatible Profiles</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.summary?.compatibleProfiles || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm font-medium text-slate-500">Shown</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data.summary?.displayedProfiles || 0}/5</p>
        </div>
      </section>

      <section className="card p-4">
        <div className="grid gap-3 md:grid-cols-[12rem_auto]">
          <select
            className="field"
            value={filters.minScore}
            onChange={(event) => setFilters((current) => ({ ...current, minScore: event.target.value }))}
          >
            <option value="">Any score</option>
            <option value="50">50% and above</option>
            <option value="70">70% and above</option>
            <option value="85">85% and above</option>
          </select>
          <button type="button" className="btn-secondary" onClick={() => setFilters({ minScore: "" })}>
            Reset
          </button>
        </div>
      </section>

      <div className="space-y-4">
        {data.matches.length ? (
          data.matches.map((match) => (
            <MatchCard key={match.customer._id} sourceCustomer={data.customer} match={match} />
          ))
        ) : (
          <div className="card p-8 text-center">
            <p className="text-sm font-semibold text-slate-700">No matching profiles found for this score.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchRecommendationsPage;
