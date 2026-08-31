import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'Customer',
  category: '',
  experience: '',
  hourlyPrice: '',
  location: '',
};

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState(initialForm);
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
      const normalizedRole = form.role === 'Service Provider' ? 'provider' : 'customer';

      setSubmitting(true);
      await signUp({
        email: form.email,
        password: form.password,
        full_name: form.fullName,
        role: normalizedRole,
        category: form.category,
        experience: form.experience,
        price: form.hourlyPrice,
        location: form.location,
      });

      navigate(normalizedRole === 'provider' ? '/provider-dashboard' : '/customer-dashboard');
    } catch (err) {
      const isRateLimitError = err?.status === 429
        || ['over_email_send_rate_limit', 'over_request_rate_limit'].includes(err?.code)
        || /rate limit|too many requests/i.test(err?.message || '');

      setError(
        isRateLimitError
          ? 'Too many registration attempts. Please wait a moment and try again.'
          : err.message || 'Unable to create account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isProvider = form.role === 'Service Provider';

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-50">Join now</p>
            <h1 className="mt-5 text-4xl font-bold leading-tight">Create your account and start connecting faster.</h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-brand-50">Build trust, book services, and grow your reputation with every job.</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-600">Register</p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900">Create an account</h2>

          {error && (
            <div role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                required
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
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
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Role</label>
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

            {isProvider && (
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Service Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option>Electrician</option>
                    <option>Plumber</option>
                    <option>Cleaner</option>
                    <option>AC Repair</option>
                    <option>Painter</option>
                    <option>Carpenter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="5 years"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Hourly Price / Rate</label>
                  <input
                    type="text"
                    name="hourlyPrice"
                    value={form.hourlyPrice}
                    onChange={handleChange}
                    placeholder="PKR 1,500/hr"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Karachi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting && <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white align-[-2px]" aria-hidden="true" />}
              {submitting ? 'Registering...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
