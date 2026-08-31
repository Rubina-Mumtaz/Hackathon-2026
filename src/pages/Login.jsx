import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'Customer',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      await signIn({ email: form.email, password: form.password });
      navigate(form.role === 'Service Provider' ? '/provider-dashboard' : '/customer-dashboard');
    } catch (err) {
      const isRateLimitError = err?.status === 429
        || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(err?.code)
        || /rate limit|too many requests/i.test(err?.message || '');

      setError(
        isRateLimitError
          ? 'Too many login attempts. Please wait a moment and try again.'
          : err.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-700 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-100">
              Welcome back
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight">Access your account and keep things moving.</h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-slate-200">Trusted by 5,000+ households and service teams.</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                  alt="customer"
                />
                <img
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
                  alt="provider"
                />
              </div>
              <p className="text-sm font-medium text-white">Customers and providers trust ServiceSphere</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Login</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Sign in to continue</h2>

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Login as</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
              >
                <option>Customer</option>
                <option>Service Provider</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white align-[-2px]" aria-hidden="true" />}
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
