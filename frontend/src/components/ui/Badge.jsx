const variants = {
  New: "bg-blue-50 text-blue-700 ring-blue-200",
  Verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Premium: "bg-amber-50 text-amber-700 ring-amber-200",
  Shortlisted: "bg-violet-50 text-violet-700 ring-violet-200",
  "Needs Review": "bg-rose-50 text-rose-700 ring-rose-200"
};

const Badge = ({ children, tone }) => {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
        variants[tone || children] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {children}
    </span>
  );
};

export default Badge;
