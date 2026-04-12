import { useState } from 'react';
import toast from 'react-hot-toast';
import SearchBar from '../components/search/SearchBar';
import SearchResultCard from '../components/SearchResultCard';
import EmptyState from '../components/common/EmptyState';
import { searchPrescriptions } from '../services/searchService';
import { fallbackSearchResults } from '../utils/fallbackData';
import { extractErrorMessage } from '../utils/helpers';

function SearchPrescriptionsPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      toast.error('Please enter a search query.');
      setHasSearched(false);
      setResults([]);
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await searchPrescriptions(trimmedQuery);
      const formattedResults = Array.isArray(response) ? response : [];
      setResults(formattedResults);
    } catch (err) {
      const message = extractErrorMessage(err, 'Search API unavailable. Showing fallback results.');
      setError(message);
      setResults(fallbackSearchResults);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    setResults([]);
  };

  return (
    <section className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-serif text-slate-900">Search Prescriptions</h2>
        <p className="mt-1 font-serif italic text-slate-600">
          Run semantic search to find specific medicines or notes across your historical records.
        </p>
      </div>

      <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} isLoading={isLoading} />

      {error ? <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 font-serif text-sm text-amber-800">{error}</p> : null}

      {hasSearched && !isLoading && results.length === 0 ? (
        <EmptyState
          title="No matching records"
          description="Try broader medication names, symptoms, or doctor notes."
        />
      ) : null}

      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard key={`${result.id}-${result.score}`} result={result} />
        ))}
      </div>
    </section>
  );
}

export default SearchPrescriptionsPage;
