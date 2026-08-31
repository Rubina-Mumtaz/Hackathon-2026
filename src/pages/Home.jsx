import { useMemo, useState } from 'react';
import ProviderCard from '../components/ProviderCard';
import { MOCK_PROVIDERS, PROVIDER_CATEGORIES } from '../utils/constants';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return MOCK_PROVIDERS.filter((provider) => {
      const matchesCategory =
        selectedCategory === 'All' || provider.category === selectedCategory;

      const matchesSearch =
        query === '' ||
        provider.name.toLowerCase().includes(query) ||
        provider.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-brand-700 px-6 py-10 text-white shadow-soft sm:px-8 lg:px-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-100">
                Trusted local professionals
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
                Find the right help for every home need.
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
                Search by service, city, or provider name and book reliable experts for repairs,
                cleaning, and maintenance.
              </p>

              <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm sm:flex-row">
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by provider or location"
                    className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    aria-label="Search providers by name or location"
                  />
                </div>
                <button className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600">
                  Search now
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-sm text-slate-500">Available today</p>
                  <p className="mt-2 text-3xl font-bold">240+</p>
                  <p className="mt-1 text-sm text-slate-600">Verified professionals</p>
                </div>
                <div className="rounded-2xl bg-white p-4 text-slate-900">
                  <p className="text-sm text-slate-500">Average rating</p>
                  <p className="mt-2 text-3xl font-bold">4.8</p>
                  <p className="mt-1 text-sm text-slate-600">Based on customer reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          {PROVIDER_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredProviders.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">No providers found</h3>
            <p className="mt-2 text-slate-500">
              Try a different search term or switch to another category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
