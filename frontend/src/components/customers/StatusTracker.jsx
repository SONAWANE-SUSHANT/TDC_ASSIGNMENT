import { useState } from "react";
import { updateCustomerStatus } from "../../api/customerApi";
import { formatDate } from "../../utils/formatters";
import Badge from "../ui/Badge";

const statuses = ["New", "Verified", "Premium", "Shortlisted", "Needs Review"];

const StatusTracker = ({ customer, onUpdated }) => {
  const [statusTag, setStatusTag] = useState(customer.statusTag);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    setLoading(true);
    setError("");

    try {
      const updated = await updateCustomerStatus(customer._id, { statusTag, note });
      setNote("");
      onUpdated(updated);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update customer status");
    } finally {
      setLoading(false);
    }
  };

  const history = [...(customer.statusHistory || [])].sort(
    (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
  );

  return (
    <section className="card p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">Customer Status Tracking</p>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-xl font-bold text-slate-950">Current status</h3>
            <Badge>{customer.statusTag}</Badge>
          </div>
        </div>
        <div className="grid w-full gap-3 lg:w-[34rem] lg:grid-cols-[1fr_1.2fr_auto]">
          <select className="field" value={statusTag} onChange={(event) => setStatusTag(event.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            className="field"
            value={note}
            placeholder="Optional status note"
            onChange={(event) => setNote(event.target.value)}
          />
          <button type="button" className="btn-primary" disabled={loading} onClick={handleUpdate}>
            {loading ? "Updating" : "Update"}
          </button>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}

      <div className="mt-6 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {history.length ? (
          history.map((item, index) => (
            <div key={`${item.status}-${item.changedAt}-${index}`} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge>{item.status}</Badge>
                  <p className="text-sm font-semibold text-slate-900">{item.changedBy}</p>
                </div>
                {item.note ? <p className="mt-2 text-sm text-slate-600">{item.note}</p> : null}
              </div>
              <p className="text-sm text-slate-500">{formatDate(item.changedAt)}</p>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-slate-600">No status history yet.</p>
        )}
      </div>
    </section>
  );
};

export default StatusTracker;
