import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";

interface MindMapNode {
  id: string;
  text: string;
  children?: MindMapNode[];
  color?: string;
}

interface MindMapProps {
  data: MindMapNode;
  className?: string;
  onNodeClick?: (node: MindMapNode) => void;
  onAddChild?: (parentId: string) => void;
}

function MindMapBranch({ node, direction, onNodeClick, onAddChild, level = 0 }: { node: MindMapNode; direction: "left" | "right"; onNodeClick?: (node: MindMapNode) => void; onAddChild?: (parentId: string) => void; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={cn("flex items-center gap-2", direction === "left" && "flex-row-reverse")}>
      <div className={cn("px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 flex items-center gap-1", level === 0 ? "bg-primary text-primary-foreground font-medium" : "bg-card border")} style={{ backgroundColor: level > 0 ? node.color : undefined }} onClick={() => onNodeClick?.(node)}>
        {hasChildren && (
          <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="p-0.5">
            {isExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </button>
        )}
        <span className="text-sm">{node.text}</span>
        {onAddChild && (
          <button onClick={(e) => { e.stopPropagation(); onAddChild(node.id); }} className="p-0.5 hover:bg-black/10 rounded">
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {hasChildren && isExpanded && (
        <>
          <div className="w-4 h-0.5 bg-border" />
          <div className="flex flex-col gap-2">
            {node.children!.map(child => (
              <MindMapBranch key={child.id} node={child} direction={direction} onNodeClick={onNodeClick} onAddChild={onAddChild} level={level + 1} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MindMap({ data, className, onNodeClick, onAddChild }: MindMapProps) {
  const leftChildren = data.children?.filter((_, i) => i % 2 === 0) || [];
  const rightChildren = data.children?.filter((_, i) => i % 2 === 1) || [];

  return (
    <div className={cn("flex items-center justify-center gap-4 p-4 overflow-auto", className)}>
      <div className="flex flex-col gap-2 items-end">
        {leftChildren.map(child => (
          <MindMapBranch key={child.id} node={child} direction="left" onNodeClick={onNodeClick} onAddChild={onAddChild} />
        ))}
      </div>
      <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium cursor-pointer" onClick={() => onNodeClick?.(data)}>{data.text}</div>
      <div className="flex flex-col gap-2 items-start">
        {rightChildren.map(child => (
          <MindMapBranch key={child.id} node={child} direction="right" onNodeClick={onNodeClick} onAddChild={onAddChild} />
        ))}
      </div>
    </div>
  );
}
export default MindMap;
