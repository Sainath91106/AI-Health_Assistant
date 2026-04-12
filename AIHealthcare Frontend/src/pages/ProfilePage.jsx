import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <p className="text-sm text-slate-600">Manage your account session and profile details.</p>
      </div>

      <div className="rounded-card border border-slate-200 bg-white p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{user?.name || 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{user?.email || 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">User ID</p>
            <p className="mt-1 break-all text-sm font-medium text-slate-900">{user?._id || 'Not available'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Session Status</p>
            <p className="mt-1 text-sm font-medium text-emerald-700">Authenticated</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4">
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
