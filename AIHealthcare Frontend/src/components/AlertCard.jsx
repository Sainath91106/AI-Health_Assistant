function AlertCard({ alert }) {
  const severityStyles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      title: 'text-red-900',
      icon: '⚠️',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      title: 'text-amber-900',
      icon: '⚡',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      title: 'text-blue-900',
      icon: 'ℹ️',
    },
  };

  const styles = severityStyles[alert.severity] || severityStyles.info;

  return (
    <div className={`rounded-card border-l-4 ${styles.border} ${styles.bg} p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{styles.icon}</span>
        <div className="flex-1">
          <h4 className={`font-semibold font-serif ${styles.title}`}>
            {alert.type}
          </h4>
          <p className="mt-1 text-sm text-slate-700">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

export default AlertCard;
