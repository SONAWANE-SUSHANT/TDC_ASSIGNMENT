const labels = {
  age: "Age Match",
  height: "Height Match",
  income: "Income Match",
  childrenPreference: "Children Preference",
  religion: "Religion",
  language: "Common Language",
  location: "Location",
  relocationPreference: "Relocation Preference",
  petsPreference: "Pets Preference"
};

const maxPoints = {
  age: 20,
  height: 15,
  income: 15,
  childrenPreference: 20,
  religion: 10,
  language: 5,
  location: 5,
  relocationPreference: 5,
  petsPreference: 5
};

const CompatibilityBreakdown = ({ breakdown, detailed = false }) => {
  const entries = Object.entries(maxPoints).map(([key, max]) => ({
    key,
    label: labels[key],
    value: breakdown?.[key] || 0,
    max
  }));

  if (detailed) {
    return (
      <div className="grid gap-2 sm:grid-cols-2">
        {entries.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <span className="text-sm font-semibold text-slate-700">{item.label}</span>
            <span className="text-sm font-bold text-slate-950">
              {item.value}/{item.max}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((item) => (
        <div key={item.key}>
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{item.label}</span>
            <span>
              {item.value}/{item.max}
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-slate-950"
              style={{ width: `${Math.min((item.value / item.max) * 100, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompatibilityBreakdown;
