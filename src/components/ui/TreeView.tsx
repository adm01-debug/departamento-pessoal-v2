import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from "lucide-react";

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: any;
}

interface TreeViewProps {
  nodes: TreeNode[];
  className?: string;
  selectedId?: string;
  expandedIds?: string[];
  showIcons?: boolean;
  onSelect?: (node: TreeNode) => void;
  onExpand?: (node: TreeNode, expanded: boolean) => void;
}

interface TreeItemProps {
  node: TreeNode;
  level: number;
  selectedId?: string;
  expandedIds: Set<string>;
  showIcons: boolean;
  onSelect?: (node: TreeNode) => void;
  onToggle: (id: string) => void;
}

function TreeItem({ node, level, selectedId, expandedIds, showIcons, onSelect, onToggle }: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div className={cn("flex items-center gap-1 px-2 py-1 cursor-pointer rounded hover:bg-accent", isSelected && "bg-accent")} style={{ paddingLeft: `${level * 16 + 8}px` }} onClick={() => { if (hasChildren) onToggle(node.id); onSelect?.(node); }}>
        {hasChildren ? (isExpanded ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />) : <span className="w-4" />}
        {showIcons && (node.icon || (hasChildren ? (isExpanded ? <FolderOpen className="h-4 w-4 text-amber-500" /> : <Folder className="h-4 w-4 text-amber-500" />) : <File className="h-4 w-4 text-muted-foreground" />))}
        <span className="text-sm truncate">{node.label}</span>
      </div>
      {hasChildren && isExpanded && node.children!.map(child => (
        <TreeItem key={child.id} node={child} level={level + 1} selectedId={selectedId} expandedIds={expandedIds} showIcons={showIcons} onSelect={onSelect} onToggle={onToggle} />
      ))}
    </div>
  );
}

export function TreeView({ nodes, className, selectedId, expandedIds: initialExpanded = [], showIcons = true, onSelect, onExpand }: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(initialExpanded));

  const handleToggle = (id: string) => {
    const newExpanded = new Set(expandedIds);
    const node = findNode(nodes, id);
    if (newExpanded.has(id)) { newExpanded.delete(id); onExpand?.(node!, false); }
    else { newExpanded.add(id); onExpand?.(node!, true); }
    setExpandedIds(newExpanded);
  };

  const findNode = (nodes: TreeNode[], id: string): TreeNode | undefined => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) { const found = findNode(node.children, id); if (found) return found; }
    }
    return undefined;
  };

  return (
    <div className={cn("py-2", className)}>
      {nodes.map(node => (
        <TreeItem key={node.id} node={node} level={0} selectedId={selectedId} expandedIds={expandedIds} showIcons={showIcons} onSelect={onSelect} onToggle={handleToggle} />
      ))}
    </div>
  );
}
export default TreeView;
