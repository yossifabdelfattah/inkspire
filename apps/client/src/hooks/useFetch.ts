import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';

interface UseFetchResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

function isAbortError(err: unknown): boolean {
  if (isAxiosError(err) && err.code === 'ERR_CANCELED') return true;
  return err instanceof DOMException && err.name === 'AbortError';
}

// Runs `fetcher` whenever `deps` change, tracking loading/error state and
// aborting the previous request if a dependency changes or the component unmounts.
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  initialData: T,
  errorMessage = 'Failed to load data.'
): UseFetchResult<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((err) => {
        if (!controller.signal.aborted && !isAbortError(err)) setError(errorMessage);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
