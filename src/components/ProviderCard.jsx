import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-52 overflow-hidden">
        <img
          src={provider.image}
          alt={provider.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent p-4">
          <span className="inline-flex rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
            {provider.category}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{provider.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{provider.location}</p>
          </div>
          <div className="rounded-full bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
            ★ {provider.rating}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{provider.experience}</span>
          <span className="font-semibold text-slate-900">{provider.price}</span>
        </div>

        <Link
          to={`/provider/${provider.id}`}
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          View Profile & Book
        </Link>
      </div>
    </article>
  );
}
