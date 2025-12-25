import { useState, useCallback } from 'react';
interface ConfirmState { open: boolean; title: string; description: string; onConfirm: () => void; }
export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({ open: false, title: '', description: '', onConfirm: () => {} });
  const confirm = useCallback((opts: { title: string; description?: string; onConfirm: () => void }) => {
    setState({ open: true, title: opts.title, description: opts.description || '', onConfirm: opts.onConfirm });
  }, []);
  const close = useCallback(() => setState(s => ({ ...s, open: false })), []);
  const handleConfirm = useCallback(() => { state.onConfirm(); close(); }, [state, close]);
  return { ...state, confirm, close, handleConfirm };
}
