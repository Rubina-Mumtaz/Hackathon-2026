import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import StarRating from '../components/StarRating';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getCustomerBookings, submitReview } from '../services/apiBookings';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const data = await getCustomerBookings(user.id);
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Unable to load bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'Completed'),
    [bookings]
  );

  const openReviewModal = (booking) => {
    if (booking.status !== 'Completed' || booking.reviewed) return;
    setSelectedBooking(booking);
    setReview({ rating: 0, comment: '' });
  };

  const closeReviewModal = () => {
    setSelectedBooking(null);
    setReview({ rating: 0, comment: '' });
  };

  const handleSubmitReview = async () => {
    if (!selectedBooking || selectedBooking.status !== 'Completed' || selectedBooking.reviewed) {
      return;
    }

    try {
      await submitReview({
        booking_id: selectedBooking.id,
        customer_id: user.id,
        rating: review.rating,
        comment: review.comment,
      });

      setBookings((current) =>
        current.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, reviewed: true } : booking
        )
      );
      closeReviewModal();
    } catch (err) {
      setError(err.message || 'Unable to submit review.');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-12 text-sm text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        Loading bookings...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Customer Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">My bookings</h1>
        </div>
        <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          {completedBookings.length} completed
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50">
              <tr className="text-sm text-slate-600">
                <th className="px-5 py-4 font-semibold">Booking ID</th>
                <th className="px-5 py-4 font-semibold">Provider</th>
                <th className="px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Date / Time</th>
                <th className="px-5 py-4 font-semibold">Location</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-900">{booking.booking_id || booking.id}</td>
                  <td className="px-5 py-4">{booking.profiles?.full_name || booking.providerName || 'Provider'}</td>
                  <td className="px-5 py-4">{booking.service}</td>
                  <td className="px-5 py-4">
                    <div>{booking.booking_date}</div>
                    <div className="text-slate-500">{booking.booking_time}</div>
                  </td>
                  <td className="px-5 py-4">{booking.location}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-4">
                    {booking.status === 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => openReviewModal(booking)}
                        disabled={booking.reviewed}
                        className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                          booking.reviewed
                            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                            : 'bg-brand-500 text-white hover:bg-brand-600'
                        }`}
                      >
                        {booking.reviewed ? 'Reviewed' : 'Write Review'}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Unavailable</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Review</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{selectedBooking.providerName}</h3>
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close review modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Your rating</label>
                <StarRating value={review.rating} onChange={(value) => setReview((prev) => ({ ...prev, rating: value }))} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Comment</label>
                <textarea
                  rows="4"
                  value={review.comment}
                  onChange={(event) => setReview((prev) => ({ ...prev, comment: event.target.value }))}
                  placeholder="Share your experience with this service"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={review.rating === 0 || review.comment.trim() === ''}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                  review.rating === 0 || review.comment.trim() === ''
                    ? 'cursor-not-allowed bg-slate-300'
                    : 'bg-brand-500 hover:bg-brand-600'
                }`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
