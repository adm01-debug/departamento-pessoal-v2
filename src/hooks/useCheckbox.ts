import { useState, useCallback, ChangeEvent } from 'react';
export function useCheckbox(initial = false) {
  const [checked, setChecked] = useState(initial);
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked), []);
  const toggle = useCallback(() => setChecked(c => !c), []);
  const reset = useCallback(() => setChecked(initial), [initial]);
  return { checked, onChange, toggle, reset, setChecked, bind: { checked, onChange, type: 'checkbox' as const } };
}
