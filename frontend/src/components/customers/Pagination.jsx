const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-600">
        Page {pagination.page} of {pagination.pages} · {pagination.total} customers
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn-secondary"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={pagination.page >= pagination.pages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
