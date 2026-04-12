import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AlertCard from '../components/AlertCard';
import HealthStatusCard from '../components/HealthStatusCard';
import Loader from '../components/Loader';
import useAuth from '../hooks/useAuth';
import { getSmartAlerts } from '../services/alertService';
import { extractErrorMessage } from '../utils/helpers';

function HealthAlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAlerts = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (!user?._id) return;
        const response = await getSmartAlerts();
        if (active) {
          setAlerts(Array.isArray(response) ? response : []);
        }
      } catch (err) {
        if (active) {
          const message = extractErrorMessage(err, 'Failed to load health alerts');
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadAlerts();
    return () => {
      active = false;
    };
  }, [user?._id]);

  if (isLoading) {
    return (
      <div className="rounded border border-slate-200 bg-white p-6 shadow-sm">
        <Loader text="Analyzing your prescriptions..." />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-none border-l-4 border-medicalBlue bg-white p-8 shadow-sm">
        <p className="font-sans text-xs font-bold uppercase tracking-widest text-medicalBlue">Health Status</p>
        <h2 className="mt-2 text-3xl font-serif text-slate-900">Health Alerts & Insights</h2>
        <p className="mt-3 font-serif italic text-lg text-slate-600">
          Smart analysis of your prescription patterns and health warnings
        </p>
      </div>

      {error && <p className="rounded bg-amber-50 px-4 py-3 text-sm font-serif border border-amber-200 text-amber-800">{error}</p>}

      {alerts.length === 0 ? (
        <HealthStatusCard />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={index} alert={alert} />
          ))}
        </div>
      )}
    </section>
  );
}

export default HealthAlertsPage;
