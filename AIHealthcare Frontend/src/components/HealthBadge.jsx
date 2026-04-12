function HealthBadge({ alertCount }) {
  if (alertCount > 0) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2">
        <span className="text-lg">⚠️</span>
        <span className="text-sm font-semibold text-amber-900">{alertCount} Health Alert{alertCount !== 1 ? 's' : ''}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2">
      <span className="text-lg">✅</span>
      <span className="text-sm font-semibold text-green-900">Health Status: Good</span>
    </div>
  );
}

export default HealthBadge;
