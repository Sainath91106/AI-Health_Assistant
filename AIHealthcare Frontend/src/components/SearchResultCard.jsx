function SearchResultCard({ result }) {
  const relevance = Math.round((result?.score || 0) * 100);

  return (
    <article className="rounded-card border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Prescription ID: {result?.metadata?.prescriptionId || result?.id}</p>
          <p className="mt-1 text-sm text-slate-600">{result?.metadata?.text || 'No summary text available.'}</p>
        </div>

        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {Number.isFinite(relevance) ? `${relevance}% match` : 'N/A'}
        </div>
      </div>
    </article>
  );
}

export default SearchResultCard;
