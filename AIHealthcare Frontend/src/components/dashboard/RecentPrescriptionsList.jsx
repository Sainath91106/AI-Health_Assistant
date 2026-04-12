import PrescriptionCard from '../PrescriptionCard';
import EmptyState from '../common/EmptyState';

function RecentPrescriptionsList({ prescriptions }) {
  if (!prescriptions?.length) {
    return (
      <EmptyState
        title="No recent prescriptions"
        description="Upload your first prescription to view recent activity."
      />
    );
  }

  return (
    <div className="space-y-3">
      {prescriptions.map((prescription) => (
        <PrescriptionCard key={prescription._id} prescription={prescription} expandable={false} />
      ))}
    </div>
  );
}

export default RecentPrescriptionsList;
