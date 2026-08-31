import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Home', to: '/' },
  { name: 'Login', to: '/login' },
  { name: 'Register', to: '/register' },
];

export default function Navbar() {
  const { role } = useAuth();
  const dashboardItem = role === 'customer'
    ? { name: 'Customer Dashboard', to: '/customer-dashboard' }
    : role === 'provider'
      ? { name: 'Provider Dashboard', to: '/provider-dashboard' }
      : null;
  const visibleNavItems = dashboardItem ? [...navItems, dashboardItem] : navItems;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" aria-label="Go to home page">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-soft">
            S
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">ServiceSphere</p>
            <p className="text-xs text-slate-500">Trusted local help</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex">
            Book a service
          </button>
          <button className="inline-flex rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
