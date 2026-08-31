import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createBooking } from '../services/apiBookings';
import { useAuth } from '../context/AuthContext';
import { MOCK_PROVIDERS } from '../utils/constants';

const defaultFormState = {
  service: 'General Service',
  date: '',
  time: '',
  address: '',
  description: '',
};

export default function ProviderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const provider = useMemo(() => {
    const selectedProvider = MOCK_PROVIDERS.find((item) => item.id === Number(id));
    return selectedProvider || MOCK_PROVIDERS[0];
  }, [id]);

  const [bookingForm, setBookingForm] = useState(defaultFormState);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await createBooking({
        customer_id: user.id,
        provider_id: provider.id,
        service: bookingForm.service,
        booking_date: bookingForm.date,
        booking_time: bookingForm.time,
        location: bookingForm.address,
        description: bookingForm.description,
      });

      setSuccessMessage(
        `Booking request sent to ${provider.name}. We will confirm your appointment shortly.`
      );
      setBookingForm(defaultFormState);

      setTimeout(() => {
        navigate('/customer-dashboard');
      }, 1200);
    } catch (error) {
      setSuccessMessage(error.message || 'Booking could not be created.');
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          ← Back to home
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          <img src={provider.image} alt={provider.name} className="h-80 w-full object-cover" />

          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
                  {provider.category}
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {provider.name}
                </h1>
              </div>

              <div className="rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700">
                ★ {provider.rating}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Location</p>
                <p className="mt-2 text-base font-semibold text-slate-800">{provider.location}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Experience</p>
                <p className="mt-2 text-base font-semibold text-slate-800">{provider.experience}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Price</p>
                <p className="mt-2 text-base font-semibold text-slate-800">{provider.price}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Availability</p>
                <p className="mt-2 text-base font-semibold text-slate-800">Open today</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">About this professional</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{provider.description}</p>
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">
              Book service
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Schedule an appointment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Service</label>
              <select
                name="service"
                value={bookingForm.service}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
              >
                <option>General Service</option>
                <option>Installation</option>
                <option>Repair</option>
                <option>Maintenance</option>
                <option>Emergency Fix</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Booking Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingForm.date}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Booking Time</label>
                <input
                  type="time"
                  name="time"
                  value={bookingForm.time}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Location / Address</label>
              <input
                type="text"
                name="address"
                value={bookingForm.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Problem Description</label>
              <textarea
                name="description"
                value={bookingForm.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Tell us what you need help with"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                required
              />
            </div>

            {successMessage && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Confirm Booking
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
