import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
interface AnnouncerContextType { announce: (message: string, priority?: 'polite' | 'assertive') => void; }
const AnnouncerContext = createContext<AnnouncerContextType>({ announce: () => {} });
export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');
  const announce = useCallback((msg: string, p: 'polite' | 'assertive' = 'polite') => { setMessage(''); setPriority(p); setTimeout(() => setMessage(msg), 50); }, []);
  return (<AnnouncerContext.Provider value={{ announce }}><div role="status" aria-live={priority} aria-atomic="true" className="sr-only">{message}</div>{children}</AnnouncerContext.Provider>);
}
export const useAnnouncer = () => useContext(AnnouncerContext);
