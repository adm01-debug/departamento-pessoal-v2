/**
 * @fileoverview Hook para controle de aria-expanded
 * @module hooks/useAriaExpanded
 */
import { useState, useCallback } from 'react';

export function useAriaExpanded(initialState = false) {
  const [isExpanded, setIsExpanded] = useState(initialState);
  
  const toggle = useCallback(() => setIsExpanded(prev => !prev), []);
  const expand = useCallback(() => setIsExpanded(true), []);
  const collapse = useCallback(() => setIsExpanded(false), []);
  
  const ariaProps = {
    'aria-expanded': isExpanded,
    onClick: toggle,
  };

  return { isExpanded, toggle, expand, collapse, ariaProps };
}

export default useAriaExpanded;
