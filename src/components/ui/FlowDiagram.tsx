import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FlowNode {
  id: string;
  type: "start" | "end" | "process" | "decision" | "connector";
  label: string;
  x: number;
  y: number;
}

interface FlowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  className?: string;
  onNodeClick?: (node: FlowNode) => void;
}

export function FlowDiagram({ nodes, edges, className, onNodeClick }: FlowDiagramProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodeShape = (type: FlowNode["type"]) => {
    switch (type) {
      case "start":
      case "end":
        return "rounded-full";
      case "decision":
        return "rotate-45";
      case "connector":
        return "rounded-full w-4 h-4";
      default:
        return "rounded-lg";
    }
  };

  const getNodeColor = (type: FlowNode["type"]) => {
    switch (type) {
      case "start": return "bg-green-500 text-white";
      case "end": return "bg-red-500 text-white";
      case "decision": return "bg-yellow-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  return (
    <div className={cn("relative bg-muted/30 rounded-lg border overflow-auto", className)} style={{ minHeight: 400 }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map(edge => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          return (
            <g key={edge.id}>
              <line x1={fromNode.x + 50} y1={fromNode.y + 20} x2={toNode.x + 50} y2={toNode.y + 20} stroke="#888" strokeWidth={2} markerEnd="url(#arrowhead)" />
              {edge.label && (
                <text x={(fromNode.x + toNode.x) / 2 + 50} y={(fromNode.y + toNode.y) / 2 + 20} className="text-xs fill-muted-foreground">{edge.label}</text>
              )}
            </g>
          );
        })}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
          </marker>
        </defs>
      </svg>
      {nodes.map(node => (
        <div key={node.id} className={cn("absolute px-4 py-2 cursor-pointer transition-transform hover:scale-105", getNodeShape(node.type), getNodeColor(node.type), selectedNode === node.id && "ring-2 ring-primary")} style={{ left: node.x, top: node.y, minWidth: node.type === "connector" ? "auto" : 100 }} onClick={() => { setSelectedNode(node.id); onNodeClick?.(node); }}>
          <span className={cn("text-sm font-medium", node.type === "decision" && "-rotate-45 block")}>{node.label}</span>
        </div>
      ))}
    </div>
  );
}
export default FlowDiagram;
