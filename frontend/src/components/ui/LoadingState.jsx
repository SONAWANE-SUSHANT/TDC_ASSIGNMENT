const LoadingState = ({ label = "Loading data" }) => {
  return (
    <div className="card flex min-h-64 items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />
        <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
};

export default LoadingState;
