const statusStyles = {
  Pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  Accepted: 'bg-blue-100 text-blue-800 border border-blue-200',
  'In Progress': 'bg-violet-100 text-violet-800 border border-violet-200',
  Completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 border border-rose-200',
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-700 border border-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {status}
    </span>
  );
}
