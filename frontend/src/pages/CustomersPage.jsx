import { useCallback, useEffect, useState } from "react";
import { fetchCustomers } from "../api/customerApi";
import CustomerFilters from "../components/customers/CustomerFilters";
import CustomerTable from "../components/customers/CustomerTable";
import Pagination from "../components/customers/Pagination";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";

const defaultFilters = {
  search: "",
  city: "",
  gender: "",
  maritalStatus: "",
  page: 1,
  limit: 10
};

const CustomersPage = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCustomers(filters);
      setData(response);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Customer Management</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">Customers</h2>
      </div>

      <CustomerFilters
        filters={filters}
        options={data?.filterOptions || {}}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
      />

      {loading ? (
        <LoadingState label="Loading customers" />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCustomers} />
      ) : data.customers.length ? (
        <>
          <CustomerTable customers={data.customers} />
          <Pagination
            pagination={data.pagination}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
          />
        </>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">No customers found.</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
