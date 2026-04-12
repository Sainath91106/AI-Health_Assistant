import { useLocation } from 'react-router-dom';
import { PAGE_TITLES } from '../common/constants';
import useAuth from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';

function Navbar({ onMenuToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const title = PAGE_TITLES[location.pathname] || 'Healthcare Dashboard';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-300 text-slate-700 md:hidden transition-colors hover:bg-slate-50"
            onClick={onMenuToggle}
            aria-label="Open navigation"
          >
            <span className="text-xl">≡</span>
          </button>
          <div>
            <h2 className="text-xl font-serif text-slate-900 leading-tight">{title}</h2>
            <p className="text-sm font-serif italic text-slate-500">Secure Patient Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="font-serif text-sm font-semibold text-slate-800 tracking-wide">{user?.name || 'Healthcare User'}</p>
            <p className="text-xs text-slate-500">{user?.email || 'user@domain.com'}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded border border-medicalBlue bg-medicalBlue/5 text-sm font-serif font-bold text-medicalBlue">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
