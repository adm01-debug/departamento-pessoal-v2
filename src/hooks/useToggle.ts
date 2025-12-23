import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setValueDirectly = useCallback((newValue: boolean) => setValue(newValue), []);

  return [value, toggle, setValueDirectly];
}

export default useToggle;
