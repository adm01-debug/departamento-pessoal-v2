import { createContext, useContext, useState, useCallback } from 'react';
interface A11yContextType { announce: (msg: string, priority?: 'polite' | 'assertive') => void; }
const A11yContext = createContext<A11yContextType>({ announce: () => {} });
export const useAnnounce = () => useContext(A11yContext);
export function A11yAnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');
  const announce = useCallback((msg: string, p: 'polite' | 'assertive' = 'polite') => {
    setMessage(''); setPriority(p); setTimeout(() => setMessage(msg), 100);
  }, []);
  return (<A11yContext.Provider value={{ announce }}>{children}<div role="status" aria-live={priority} aria-atomic="true" className="sr-only">{message}</div></A11yContext.Provider>);
}
