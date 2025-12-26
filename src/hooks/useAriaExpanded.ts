import { useState, useCallback } from 'react';
export function useAriaExpanded(initial = false) {
  const [expanded, setExpanded] = useState(initial);
  const toggle = useCallback(() => setExpanded(e => !e), []);
  const ariaProps = { 'aria-expanded': expanded, onClick: toggle };
  return { expanded, setExpanded, toggle, ariaProps };
}
