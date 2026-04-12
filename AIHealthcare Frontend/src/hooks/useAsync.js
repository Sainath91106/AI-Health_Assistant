import { useCallback, useState } from 'react';

const useAsync = (asyncFunction) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError('');

      try {
        const result = await asyncFunction(...args);
        return result;
      } catch (err) {
        setError(err?.message || 'Request failed');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFunction]
  );

  return {
    run,
    isLoading,
    error,
    setError,
  };
};

export default useAsync;
