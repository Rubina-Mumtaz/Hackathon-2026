import { useEffect, useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { getProviderBookings, updateBookingStatus } from '../services/apiBookings';

export default function ProviderDashboard() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || !profile) return;

      try {
        const data = await getProviderBookings(user.id);
        setRequests(data);
      } catch (err) {
        setError(err.message || 'Unable to load provider requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, profile]);

  const updateStatus = async (bookingId, nextStatus) => {
    try {
      await updateBookingStatus(bookingId, user.id, nextStatus);
      setRequests((current) =>
        current.map((request) =>
          request.id === bookingId ? { ...request, status: nextStatus } : request
        )
      );
    } catch (err) {
      setError(err.message || 'Unable to update booking status.');
    }
  };

  const getActions = (request) => {
    if (request.status === 'Pending') {
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateStatus(request.id, 'Accepted')}
            className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => updateStatus(request.id, 'Rejected')}
            className="rounded-full bg-rose-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
          >
            Reject
          </button>
        </div>
      );
    }

    if (request.status === 'Accepted') {
      return (
        <button
          type="button"
          onClick={() => updateStatus(request.id, 'In Progress')}
          className="rounded-full bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-600"
        >
          Mark In Progress
        </button>
      );
    }

    if (request.status === 'In Progress') {
      return (
        <button
          type="button"
          onClick={() => updateStatus(request.id, 'Completed')}
          className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600"
        >
          Mark Completed
        </button>
      );
    }

    return <StatusBadge status={request.status} />;
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-12 text-sm text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        Loading requests...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">Provider Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Incoming requests</h1>
        </div>
        <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          {requests.length} new requests
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        {requests.map((request) => (
          <div key={request.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{request.booking_id || request.id}</h2>
                  <StatusBadge status={request.status} />
                </div>

                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Customer</p>
                    <p className="mt-1 font-medium text-slate-800">{request.profiles?.full_name || request.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Service</p>
                    <p className="mt-1 font-medium text-slate-800">{request.service}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Location</p>
                    <p className="mt-1 font-medium text-slate-800">{request.location}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Date / Time</p>
                    <p className="mt-1 font-medium text-slate-800">
                      {request.booking_date} • {request.booking_time}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-700">{request.description}</p>
                </div>
              </div>

              <div className="lg:min-w-[220px] lg:text-right">{getActions(request)}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
