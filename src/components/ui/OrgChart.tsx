import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight } from "lucide-react";

interface OrgNode {
  id: string;
  name: string;
  title?: string;
  avatar?: string;
  children?: OrgNode[];
}

interface OrgChartProps {
  data: OrgNode;
  className?: string;
  onNodeClick?: (node: OrgNode) => void;
}

function OrgNodeComponent({ node, onNodeClick, level = 0 }: { node: OrgNode; onNodeClick?: (node: OrgNode) => void; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", level === 0 && "border-primary")} onClick={() => onNodeClick?.(node)}>
        <CardContent className="p-3 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={node.avatar} />
            <AvatarFallback>{node.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{node.name}</p>
            {node.title && <p className="text-xs text-muted-foreground">{node.title}</p>}
          </div>
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="ml-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
        </CardContent>
      </Card>
      {hasChildren && isExpanded && (
        <>
          <div className="w-0.5 h-4 bg-border" />
          <div className="flex gap-4">
            {node.children!.map((child, i) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="flex items-center">
                  {i > 0 && <div className="h-0.5 w-4 bg-border" />}
                  <div className="w-0.5 h-4 bg-border" />
                  {i < node.children!.length - 1 && <div className="h-0.5 w-4 bg-border" />}
                </div>
                <OrgNodeComponent node={child} onNodeClick={onNodeClick} level={level + 1} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function OrgChart({ data, className, onNodeClick }: OrgChartProps) {
  return (
    <div className={cn("flex justify-center p-4 overflow-auto", className)}>
      <OrgNodeComponent node={data} onNodeClick={onNodeClick} />
    </div>
  );
}
export default OrgChart;
