import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCustomers } from "../api/customerApi";
import CustomerCard from "../components/customers/CustomerCard";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import StatCard from "../components/ui/StatCard";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCustomers({ page: 1, limit: 6 });
      setData(response);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingState label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const stats = data.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Dashboard</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-950">Customer overview</h2>
        </div>
        <Link to="/customers" className="btn-primary">
          Browse Customers
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customers" value={stats.totalCustomers || 0} helper="Active matrimonial profiles" />
        <StatCard label="Verified" value={stats.verifiedCustomers || 0} helper="Ready for recommendations" />
        <StatCard label="Premium" value={stats.premiumCustomers || 0} helper="Priority matchmaking queue" />
        <StatCard label="Average Age" value={Math.round(stats.averageAge || 0)} helper="Across current database" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-950">Recent customers</h3>
          <Link to="/customers" className="text-sm font-semibold text-slate-700 hover:text-slate-950">
            View all
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {data.customers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
