import { useState, useCallback, FocusEvent } from 'react';
export function useFocus() {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = useCallback((e?: FocusEvent) => setIsFocused(true), []);
  const onBlur = useCallback((e?: FocusEvent) => setIsFocused(false), []);
  return { isFocused, onFocus, onBlur, focusProps: { onFocus, onBlur } };
}
