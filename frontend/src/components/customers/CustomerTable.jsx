import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import { formatCurrency, fullName } from "../../utils/formatters";

const CustomerTable = ({ customers }) => {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Name</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Age</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">City</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Status</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Profession</th>
              <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-normal text-slate-500">Income</th>
              <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-normal text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {customers.map((customer) => (
              <tr key={customer._id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-slate-950">{fullName(customer)}</p>
                    <p className="text-sm text-slate-500">{customer.maritalStatus}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{customer.age}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{customer.city}</td>
                <td className="px-5 py-4">
                  <Badge>{customer.statusTag}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-slate-700">{customer.profession}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{formatCurrency(customer.income)}</td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/customers/${customer._id}`} className="btn-secondary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
