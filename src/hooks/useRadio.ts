import { useState, useCallback, ChangeEvent } from 'react';
export function useRadio<T extends string>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value as T), []);
  const reset = useCallback(() => setValue(initial), [initial]);
  const isSelected = useCallback((v: T) => value === v, [value]);
  return { value, onChange, reset, setValue, isSelected };
}
