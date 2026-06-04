import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: "admin@matchmaker.ai",
    password: "admin123"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f7f3eb] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
         <div className="mb-8">
<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8e570c] shadow-lg ring-4 ring-[#EBC796]/20">
  <span
    className="text-3xl italic text-white"
    style={{ fontFamily: '"Cormorant Garamond", serif' }}
  >
    tdc
  </span>
</div>

  <h1 className="mt-6 text-3xl font-bold text-[#1a1925]">
    The Date Crew
  </h1>

  <p className="mt-2 text-sm leading-6 text-[#386058]">
    Internal access for curated partner search recommendations.
  </p>
</div>

          <form onSubmit={handleSubmit} className="card space-y-5 p-6">
            {error ? <p className="rounded-md bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p> : null}
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="field mt-2"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="field mt-2"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in" : "Sign in"}
            </button>
          </form>
        </div>
      </section>

      <section className="hidden bg-[#1a1925] p-10 text-white lg:flex lg:items-end">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-[#8e570c]">The Date Crew</p>
          <h2
  className="mt-4 text-2xl font-medium leading-relaxed text-white"
  style={{ fontFamily: '"Cormorant Garamond", serif' }}
>
  Creating meaningful connections through thoughtful matchmaking, compatibility insights, and personalized introductions.
</h2>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {["100 seeded profiles", "10 scoring factors", "Gemini messages"].map((item) => (
              <div key={item} className="rounded-lg border border-[#8e570c]/30 bg-white/5 p-4">
                <p className="text-sm font-semibold text-slate-100">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
