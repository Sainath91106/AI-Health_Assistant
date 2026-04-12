import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blue-50/60 px-4">
      <div className="rounded-card border border-slate-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold text-blue-700">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-5 inline-flex">
          Return to Dashboard
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
