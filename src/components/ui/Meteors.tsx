import React from "react";
import { cn } from "@/lib/utils";

interface MeteorsProps {
  count?: number;
  className?: string;
}

export function Meteors({ count = 20, className }: MeteorsProps) {
  const meteors = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {meteors.map(m => (
        <span key={m.id} className="absolute top-0 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]" style={{ left: `${m.left}%`, animationDelay: `${m.delay}s`, animationDuration: `${m.duration}s` }}>
          <span className="absolute top-1/2 -translate-y-1/2 w-[50px] h-[1px] bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
      <style>{`@keyframes meteor { 0% { transform: rotate(215deg) translateX(0); opacity: 1; } 70% { opacity: 1; } 100% { transform: rotate(215deg) translateX(-500px); opacity: 0; } } .animate-meteor { animation: meteor linear infinite; }`}</style>
    </div>
  );
}
export default Meteors;
