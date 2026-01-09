import React, { useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  children: React.ReactNode;
  color?: string;
  duration?: number;
  className?: string;
}

export function Ripple({ children, color = "rgba(255,255,255,0.4)", duration = 600, className }: RippleProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), duration);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} onClick={handleClick}>
      {children}
      {ripples.map(r => (
        <span key={r.id} className="absolute rounded-full animate-ripple pointer-events-none" style={{ left: r.x, top: r.y, backgroundColor: color, animationDuration: `${duration}ms` }} />
      ))}
      <style>{`@keyframes ripple { from { width: 0; height: 0; opacity: 0.5; transform: translate(-50%, -50%); } to { width: 500px; height: 500px; opacity: 0; transform: translate(-50%, -50%); } } .animate-ripple { animation: ripple ease-out forwards; }`}</style>
    </div>
  );
}
export default Ripple;
