import { NavLink } from 'react-router-dom';
import { APP_NAME, NAV_ITEMS } from '../common/constants';

function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white px-4 py-6 transition-transform duration-200 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 border-b border-slate-200 pb-4">
        <p className="font-serif text-sm italic tracking-widest text-slate-500">Healthcare Portal</p>
        <h1 className="mt-2 text-xl font-bold text-medicalBlue">{APP_NAME}</h1>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm font-medium transition-colors border-l-4 ${
                isActive
                  ? 'border-medicalBlue bg-slate-50 text-medicalBlue'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
