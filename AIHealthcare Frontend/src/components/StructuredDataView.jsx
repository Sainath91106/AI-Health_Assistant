import { parseStructuredData, safeArray } from '../utils/helpers';

function StructuredDataView({ data }) {
  const structuredData = parseStructuredData(data) || {};
  const medicines = safeArray(structuredData.medicines);

  return (
    <section className="rounded-card border border-slate-200 bg-white p-5 shadow-card">
      <h3 className="text-sm font-semibold text-slate-900">Structured Prescription Data</h3>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Doctor</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{structuredData.doctor || 'Not available'}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Notes</p>
          <p className="mt-1 text-sm font-medium text-slate-800">{structuredData.notes || 'No notes available'}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines</p>

        {medicines.length > 0 ? (
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3">Name</th>
                  <th className="px-3">Dosage</th>
                  <th className="px-3">Frequency</th>
                  <th className="px-3">Duration</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={`${medicine.name}-${index}`} className="rounded-lg bg-slate-50 text-slate-800">
                    <td className="px-3 py-2 font-medium">{medicine.name || 'N/A'}</td>
                    <td className="px-3 py-2">{medicine.dosage || 'N/A'}</td>
                    <td className="px-3 py-2">{medicine.frequency || 'N/A'}</td>
                    <td className="px-3 py-2">{medicine.duration || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No medicine data extracted.</p>
        )}
      </div>
    </section>
  );
}

export default StructuredDataView;
