import { useState, useCallback, ChangeEvent } from 'react';
export function useSelect<T extends string>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  const onChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => setValue(e.target.value as T), []);
  const reset = useCallback(() => setValue(initial), [initial]);
  return { value, onChange, reset, setValue, bind: { value, onChange } };
}
