import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatCurrency, fullName } from "../../utils/formatters";

const CustomerCard = ({ customer }) => {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-slate-950">{fullName(customer)}</p>
          <p className="text-sm text-slate-500">
            {customer.age} years, {customer.city}
          </p>
        </div>
        <Badge>{customer.statusTag}</Badge>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="label">Profession</dt>
          <dd className="mt-1 font-semibold text-slate-900">{customer.profession}</dd>
        </div>
        <div>
          <dt className="label">Income</dt>
          <dd className="mt-1 font-semibold text-slate-900">{formatCurrency(customer.income)}</dd>
        </div>
        <div>
          <dt className="label">Religion</dt>
          <dd className="mt-1 font-semibold text-slate-900">{customer.religion}</dd>
        </div>
        <div>
          <dt className="label">Marital</dt>
          <dd className="mt-1 font-semibold text-slate-900">{customer.maritalStatus}</dd>
        </div>
      </dl>
      <div className="mt-5 flex gap-3">
        <Link to={`/customers/${customer._id}`} className="btn-secondary flex-1">
          Details
        </Link>
        <Link to={`/customers/${customer._id}/matches`} className="btn-primary flex-1">
          Matches
        </Link>
      </div>
    </div>
  );
};

export default CustomerCard;
