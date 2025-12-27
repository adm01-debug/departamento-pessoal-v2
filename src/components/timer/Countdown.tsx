import { useState, useEffect } from 'react';
interface CountdownProps { targetDate: Date | string; onComplete?: () => void; className?: string; }
export function Countdown({ targetDate, onComplete, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const interval = setInterval(() => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { clearInterval(interval); onComplete?.(); return; }
      setTimeLeft({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);
  return <span className={className}>{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>;
}
