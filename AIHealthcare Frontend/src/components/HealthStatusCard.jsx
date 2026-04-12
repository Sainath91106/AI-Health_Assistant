function HealthStatusCard() {
  return (
    <div className="rounded-card border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-8 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="text-5xl">✅</div>
        <div>
          <h3 className="text-2xl font-serif font-semibold text-green-900">
            Your Health Status is Excellent!
          </h3>
          <p className="mt-2 text-base text-green-800">
            No concerning patterns detected in your prescriptions. Your medication usage looks healthy and well-managed.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-green-700">
            <li>✓ No repeated medication concerns</li>
            <li>✓ Antibiotic usage within normal ranges</li>
            <li>✓ Prescription frequency is balanced</li>
            <li>✓ No duplicate prescription patterns detected</li>
          </ul>
          <p className="mt-4 text-sm italic text-green-600">
            Keep up with regular check-ups and maintain medication adherence as prescribed by your doctor.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HealthStatusCard;
