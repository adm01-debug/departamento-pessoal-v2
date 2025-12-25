import { useState, useCallback } from 'react';
export function useSelection<T extends string | number>(initialSelected: T[] = []) {
  const [selected, setSelected] = useState<Set<T>>(new Set(initialSelected));
  const toggle = useCallback((id: T) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const select = useCallback((id: T) => setSelected(prev => new Set(prev).add(id)), []);
  const deselect = useCallback((id: T) => setSelected(prev => { const n = new Set(prev); n.delete(id); return n; }), []);
  const selectAll = useCallback((ids: T[]) => setSelected(new Set(ids)), []);
  const clear = useCallback(() => setSelected(new Set()), []);
  const isSelected = useCallback((id: T) => selected.has(id), [selected]);
  return { selected: Array.from(selected), toggle, select, deselect, selectAll, clear, isSelected, count: selected.size };
}
