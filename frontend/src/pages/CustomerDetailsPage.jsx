import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCustomerById } from "../api/customerApi";
import DetailItem from "../components/customers/DetailItem";
import StatusTracker from "../components/customers/StatusTracker";
import Badge from "../components/ui/Badge";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import { formatCurrency, formatDate, formatHeight, fullName } from "../utils/formatters";

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomer = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetchCustomerById(id);
      setCustomer(response);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load customer details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  if (loading) return <LoadingState label="Loading profile" />;
  if (error) return <ErrorState message={error} onRetry={loadCustomer} />;

  const details = [
    ["First Name", customer.firstName],
    ["Last Name", customer.lastName],
    ["Gender", customer.gender],
    ["Date Of Birth", formatDate(customer.dateOfBirth)],
    ["Country", customer.country],
    ["City", customer.city],
    ["State", customer.state],
    ["Height", formatHeight(customer.height)],
    ["Email", customer.email],
    ["Phone Number", customer.phoneNumber],
    ["Undergraduate College", customer.undergraduateCollege],
    ["Degree", customer.degree],
    ["Income", formatCurrency(customer.income)],
    ["Current Company", customer.currentCompany],
    ["Designation", customer.designation],
    ["Profession", customer.profession],
    ["Marital Status", customer.maritalStatus],
    ["Languages Known", customer.languagesKnown.join(", ")],
    ["Siblings", customer.siblings],
    ["Caste", customer.caste],
    ["Religion", customer.religion],
    ["Want Kids", customer.wantKids],
    ["Open To Relocate", customer.openToRelocate],
    ["Open To Pets", customer.openToPets]
  ];

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-950">{fullName(customer)}</h2>
              <Badge>{customer.statusTag}</Badge>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {customer.age} years · {customer.city}, {customer.state} · {customer.maritalStatus}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">{customer.bio}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/customers" className="btn-secondary">
              Back
            </Link>
            <Link to={`/customers/${customer._id}/matches`} className="btn-primary">
              View Matches
            </Link>
          </div>
        </div>
      </section>

      <StatusTracker customer={customer} onUpdated={setCustomer} />

      <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {details.map(([label, value]) => (
          <DetailItem key={label} label={label} value={value} />
        ))}
      </dl>
    </div>
  );
};

export default CustomerDetailsPage;
