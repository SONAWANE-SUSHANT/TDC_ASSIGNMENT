const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="card p-6">
      <p className="text-sm font-semibold text-rose-700">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          Retry
        </button>
      ) : null}
    </div>
  );
};

export default ErrorState;
