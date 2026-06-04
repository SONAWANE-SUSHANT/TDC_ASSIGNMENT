import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="card max-w-md p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-600">The dashboard route you opened does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-6">
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
