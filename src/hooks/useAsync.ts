import { useState, useCallback, useEffect } from "react";
interface AsyncState<T> { data: T | null; loading: boolean; error: Error | null; }
export function useAsync<T>(asyncFn: () => Promise<T>, immediate = true): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: immediate, error: null });
  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try { const data = await asyncFn(); setState({ data, loading: false, error: null }); }
    catch (error) { setState({ data: null, loading: false, error: error as Error }); }
  }, [asyncFn]);
  useEffect(() => { if (immediate) execute(); }, [execute, immediate]);
  return { ...state, execute };
}
export default useAsync;
