import { useState, useCallback } from 'react';
export function useBulkActions<T extends { id: string }>() {
  const [selected, setSelected] = useState<string[]>([]);
  const select = useCallback((id: string) => setSelected(s => [...s, id]), []);
  const deselect = useCallback((id: string) => setSelected(s => s.filter(i => i !== id)), []);
  const toggle = useCallback((id: string) => setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id]), []);
  const selectAll = useCallback((items: T[]) => setSelected(items.map(i => i.id)), []);
  const clear = useCallback(() => setSelected([]), []);
  return { selected, select, deselect, toggle, selectAll, clear, hasSelection: selected.length > 0 };
}
