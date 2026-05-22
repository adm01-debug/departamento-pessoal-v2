import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface Segment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function DonutChart({ segments, size = 140, strokeWidth = 16, className }: DonutChartProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });

  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const segmentsWithOffsets = useMemo(() => {
    let offset = 0;
    return segments.map(seg => {
      const segLength = (seg.value / total) * circumference;
      const currentOffset = offset;
      offset += segLength;
      return { ...seg, segLength, offset: currentOffset };
    });
  }, [segments, total, circumference]);

  return (
    <div className={className}>
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {segmentsWithOffsets.map((seg, i) => {
          const gap = segments.length > 1 ? 3 : 0;
          const dashArray = `${Math.max(seg.segLength - gap, 0)} ${circumference - seg.segLength + gap}`;
          const strokeOffset = -seg.offset + circumference * 0.25; // start from top

          return (
            <motion.circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
            />
          );
        })}
        {/* Center text */}
        <text x={center} y={center - 6} textAnchor="middle" className="fill-foreground font-display text-xl font-bold">{total}</text>
        <text x={center} y={center + 12} textAnchor="middle" className="fill-muted-foreground font-body text-[10px]">Total</text>
      </svg>

      {/* Legend */}
      <div className="mt-3 space-y-1.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2 text-caption">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="flex-1 text-muted-foreground font-body truncate">{seg.label}</span>
            <span className="font-display font-semibold">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
