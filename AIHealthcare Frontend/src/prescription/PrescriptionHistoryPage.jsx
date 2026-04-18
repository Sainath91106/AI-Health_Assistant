import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PrescriptionCard from '../components/PrescriptionCard';
import Loader from '../components/Loader';
import EmptyState from '../components/common/EmptyState';
import useAuth from '../hooks/useAuth';
import { getUserPrescriptions, deletePrescription } from '../services/prescriptionService';
import { fallbackPrescriptions } from '../utils/fallbackData';
import { extractErrorMessage } from '../utils/helpers';

const sortByLatest = (items = []) =>
  [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

function PrescriptionHistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (!user?._id) {
          throw new Error('User id unavailable');
        }

        const response = await getUserPrescriptions(user._id);
        const records = Array.isArray(response) && response.length ? response : fallbackPrescriptions;

        if (active) {
          setHistory(sortByLatest(records));
        }
      } catch (err) {
        const message = extractErrorMessage(err, 'Unable to fetch prescription history. Showing fallback data.');

        if (active) {
          setError(message);
          setHistory(sortByLatest(fallbackPrescriptions));
          toast.error(message);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchHistory();
    return () => {
      active = false;
    };
  }, [user?._id]);

  const handleDelete = async (prescriptionId) => {
    const originalHistory = [...history];
    const optimisticHistory = history.filter((p) => p._id !== prescriptionId);
    setHistory(optimisticHistory);
    toast.success('Prescription deleted');

    try {
      await deletePrescription(prescriptionId);
    } catch (err) {
      const message = extractErrorMessage(err, 'Failed to delete prescription');
      toast.error(message);
      setHistory(originalHistory);
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Prescription History</h2>
        <p className="text-sm text-slate-600">Review all uploaded prescriptions with expandable clinical details.</p>
      </div>

      {isLoading ? (
        <div className="rounded-card border border-slate-200 bg-white p-6 shadow-card">
          <Loader text="Loading prescription history..." />
        </div>
      ) : null}

      {error ? <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{error}</p> : null}

      {!isLoading && history.length === 0 ? (
        <EmptyState
          title="No prescriptions found"
          description="Uploaded prescriptions will appear here for chronological review."
        />
      ) : null}

      {!isLoading && history.length > 0 ? (
        <div className="relative ml-3 space-y-4 border-l border-slate-200 pl-5">
          {history.map((prescription) => (
            <div key={prescription._id} className="relative">
              <span className="absolute -left-[29px] top-6 h-3 w-3 rounded-full border-2 border-white bg-medicalBlue" />
              <PrescriptionCard prescription={prescription} expandable onDelete={() => handleDelete(prescription._id)} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default PrescriptionHistoryPage;
