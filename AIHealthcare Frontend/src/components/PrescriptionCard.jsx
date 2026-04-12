import { useMemo, useState } from 'react';
import { formatDate, parseStructuredData, safeArray } from '../utils/helpers';

function PrescriptionCard({ prescription, expandable = true }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const structuredData = useMemo(
    () => parseStructuredData(prescription?.structuredData) || {},
    [prescription?.structuredData]
  );

  const medicines = safeArray(structuredData.medicines);

  return (
    <article className="rounded-card border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {structuredData.doctor || 'Doctor details unavailable'}
          </p>
          <p className="mt-1 text-xs text-slate-500">Uploaded {formatDate(prescription?.createdAt)}</p>
        </div>

        {expandable ? (
          <button
            type="button"
            className="text-xs font-medium text-medicalBlue"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Prescription ID</p>
          <p className="mt-1 font-medium text-slate-800">{prescription?._id || 'Not available'}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Medicines</p>
          <p className="mt-1 font-medium text-slate-800">{medicines.length}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Notes</p>
          <p className="mt-1 line-clamp-1 font-medium text-slate-800">{structuredData.notes || 'No notes available'}</p>
        </div>
      </div>

      {(!expandable || isExpanded) && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Medicines</p>
            {medicines.length > 0 ? (
              <div className="mt-2 space-y-2">
                {medicines.map((medicine, index) => (
                  <div key={`${medicine.name}-${index}`} className="rounded-lg bg-blue-50/50 p-3 text-sm">
                    <p className="font-medium text-slate-900">{medicine.name || 'Unnamed medicine'}</p>
                    <p className="text-xs text-slate-600">
                      {medicine.dosage || 'Dosage N/A'} | {medicine.frequency || 'Frequency N/A'} | {medicine.duration || 'Duration N/A'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Medicine details unavailable.</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Extracted Notes</p>
            <p className="mt-1 text-sm text-slate-700">{structuredData.notes || 'No additional notes.'}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default PrescriptionCard;
