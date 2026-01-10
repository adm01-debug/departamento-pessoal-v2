import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TreeItem { id: string; label: string; children?: TreeItem[]; }
interface HierarchyTreeProps { data: TreeItem[]; onSelect?: (node: TreeItem) => void; className?: string; }

export function HierarchyTree({ data, onSelect, className }: HierarchyTreeProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) => { const next = new Set(expanded); if (next.has(id)) next.delete(id); else next.add(id); setExpanded(next); };
  const renderNode = (node: TreeItem, level: number): React.ReactNode => (
    <div key={node.id}>
      <div className="flex items-center gap-1 py-1 px-2 rounded hover:bg-muted cursor-pointer" style={{ marginLeft: level * 16 }} onClick={() => { if (node.children?.length) toggle(node.id); else onSelect?.(node); }}>
        {node.children?.length ? <ChevronRight className={cn("h-4 w-4", expanded.has(node.id) && "rotate-90")} /> : <span className="w-4" />}
        <span className="text-sm">{node.label}</span>
      </div>
      {expanded.has(node.id) && node.children?.map((child) => renderNode(child, level + 1))}
    </div>
  );
  return <div className={className}>{data.map((node) => renderNode(node, 0))}</div>;
}
export default HierarchyTree;
