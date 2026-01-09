import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  className?: string;
}

export function Confetti({ active, duration = 3000, particleCount = 50, className }: ConfettiProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ["#f43f5e", "#22c55e", "#3b82f6", "#eab308", "#a855f7", "#ec4899"];
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), duration);
    }
  }, [active, duration, particleCount]);

  if (particles.length === 0) return null;

  return (
    <div className={cn("fixed inset-0 pointer-events-none z-50 overflow-hidden", className)}>
      {particles.map(p => (
        <div key={p.id} className="absolute top-0 w-3 h-3 rounded-full animate-confetti" style={{ left: `${p.x}%`, backgroundColor: p.color, animationDelay: `${p.delay}s` }} />
      ))}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti { animation: confetti 3s ease-out forwards; }
      `}</style>
    </div>
  );
}
export default Confetti;
