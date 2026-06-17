import { useEffect, useReducer } from 'react';
import { isAxiosError } from 'axios';

interface UseFetchResult<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface FetchState<T> { data: T; loading: boolean; error: string | null }
type FetchAction<T> =
  | { type: 'start' }
  | { type: 'success'; data: T }
  | { type: 'error'; message: string };

function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
  switch (action.type) {
    case 'start':   return { ...state, loading: true, error: null };
    case 'success': return { data: action.data, loading: false, error: null };
    case 'error':   return { ...state, loading: false, error: action.message };
    default:        return state;
  }
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
  const [state, dispatch] = useReducer(fetchReducer<T>, {
    data: initialData,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'start' });

    fetcher(controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) dispatch({ type: 'success', data: result });
      })
      .catch((err) => {
        if (!controller.signal.aborted && !isAbortError(err))
          dispatch({ type: 'error', message: errorMessage });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
