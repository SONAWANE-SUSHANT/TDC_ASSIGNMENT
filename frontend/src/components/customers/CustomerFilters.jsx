const CustomerFilters = ({ filters, options, onChange, onReset }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  return (
    <div className="card p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <input
          className="field xl:col-span-2"
          placeholder="Search name, city, profession"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
        />
        <select className="field" value={filters.city} onChange={(event) => update("city", event.target.value)}>
          <option value="">All cities</option>
          {(options.cities || []).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select className="field" value={filters.gender} onChange={(event) => update("gender", event.target.value)}>
          <option value="">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          className="field"
          value={filters.maritalStatus}
          onChange={(event) => update("maritalStatus", event.target.value)}
        >
          <option value="">All marital status</option>
          {(options.maritalStatuses || []).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button type="button" className="btn-secondary" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default CustomerFilters;
