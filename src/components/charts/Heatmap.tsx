import React from "react";
import { cn } from "@/lib/utils";
interface HeatmapProps { data: { x: string; y: string; value: number }[]; xLabels: string[]; yLabels: string[]; colorScale?: string[]; cellSize?: number; showValues?: boolean; }
export function Heatmap({ data, xLabels, yLabels, colorScale = ["#f0fdf4", "#86efac", "#22c55e", "#15803d"], cellSize = 40, showValues = true }: HeatmapProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const getColor = (value: number) => { const index = Math.min(Math.floor((value / maxValue) * (colorScale.length - 1)), colorScale.length - 1); return colorScale[index]; };
  const getValue = (x: string, y: string) => data.find(d => d.x === x && d.y === y)?.value || 0;
  return (
    <div className="overflow-auto"><table className="border-collapse"><thead><tr><th></th>{xLabels.map(x => <th key={x} className="p-1 text-xs text-muted-foreground">{x}</th>)}</tr></thead><tbody>{yLabels.map(y => <tr key={y}><td className="p-1 text-xs text-muted-foreground text-right pr-2">{y}</td>{xLabels.map(x => { const value = getValue(x, y); return <td key={`${x}-${y}`} className="p-0.5"><div className="rounded flex items-center justify-center" style={{ width: cellSize, height: cellSize, backgroundColor: getColor(value) }}>{showValues && <span className="text-xs font-medium">{value}</span>}</div></td>; })}</tr>)}</tbody></table></div>
  );
}
export default Heatmap;
