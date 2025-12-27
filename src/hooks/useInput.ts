import { useState, useCallback, ChangeEvent } from 'react';
export function useInput(initial = '') {
  const [value, setValue] = useState(initial);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value), []);
  const reset = useCallback(() => setValue(initial), [initial]);
  const clear = useCallback(() => setValue(''), []);
  return { value, onChange, reset, clear, setValue, bind: { value, onChange } };
}
