export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
              S
            </div>
            <div>
              <p className="text-lg font-bold text-white">ServiceSphere</p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-slate-400">
            Connecting customers and trusted local service providers for everyday support.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
            Explore
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
            <li><a href="/register" className="hover:text-white">Register</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
            For users
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li><a href="/customer-dashboard" className="hover:text-white">Customer dashboard</a></li>
            <li><a href="/provider-dashboard" className="hover:text-white">Provider dashboard</a></li>
            <li><a href="/" className="hover:text-white">How it works</a></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
            Contact
          </h3>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>hello@servicesphere.com</li>
            <li>+1 (555) 203-0045</li>
            <li>Mon–Sat • 8am–8pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-sm text-slate-400 sm:px-6 lg:px-8">
          <p>© 2026 ServiceSphere. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white">Privacy</a>
            <a href="/" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
