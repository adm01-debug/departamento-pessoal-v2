import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface SparklesTextProps {
  children: React.ReactNode;
  sparkleCount?: number;
  className?: string;
}

export function SparklesText({ children, sparkleCount = 3, className }: SparklesTextProps) {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => {
        const newSparkle = { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 8 + 4 };
        return [...prev.slice(-sparkleCount + 1), newSparkle];
      });
    }, 500);
    return () => clearInterval(interval);
  }, [sparkleCount]);

  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      {sparkles.map(s => (
        <Sparkles key={s.id} className="absolute text-yellow-400 animate-sparkle pointer-events-none" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }} />
      ))}
      <style>{`@keyframes sparkle { 0% { opacity: 0; transform: scale(0); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(0); } } .animate-sparkle { animation: sparkle 1s ease-out forwards; }`}</style>
    </span>
  );
}
export default SparklesText;
