const DetailItem = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <dt className="label">{label}</dt>
      <dd className="mt-2 text-sm font-semibold text-slate-950">{value || "Not provided"}</dd>
    </div>
  );
};

export default DetailItem;
