function SearchBar({ value, onChange, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="rounded-card border border-slate-200 bg-white p-4 shadow-card">
      <label htmlFor="search-query" className="mb-2 block text-sm font-medium text-slate-700">
        Search Across Prescriptions
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="search-query"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="input-base"
          placeholder="Try: blood pressure medicines, diabetes dosage, follow-up advice"
        />
        <button type="submit" disabled={isLoading} className="btn-primary sm:w-40">
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
