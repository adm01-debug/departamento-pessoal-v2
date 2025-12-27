import { useState, useEffect } from 'react';
interface StopwatchProps { running: boolean; className?: string; }
export function Stopwatch({ running, className }: StopwatchProps) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (!running) return; const interval = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(interval); }, [running]);
  const mins = Math.floor(elapsed / 60), secs = elapsed % 60;
  return <span className={className}>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>;
}
