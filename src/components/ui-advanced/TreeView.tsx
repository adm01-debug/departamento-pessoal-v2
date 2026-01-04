import React from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
interface TreeNode { id: string; label: string; children?: TreeNode[]; icon?: React.ReactNode; }
interface Props { data: TreeNode[]; onSelect?: (node: TreeNode) => void; defaultExpanded?: string[]; }
export function TreeView({ data, onSelect, defaultExpanded = [] }: Props) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(defaultExpanded));
  const toggle = (id: string) => setExpanded(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const renderNode = (node: TreeNode, level: number = 0) => (<div key={node.id}><div className="flex items-center gap-1 py-1 px-2 hover:bg-muted rounded cursor-pointer" style={{ paddingLeft: level * 16 }} onClick={() => { if (node.children) toggle(node.id); onSelect?.(node); }}>{node.children ? (expanded.has(node.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />) : <span className="w-4" />}{node.icon || (node.children ? <Folder className="h-4 w-4 text-yellow-500" /> : <File className="h-4 w-4" />)}<span>{node.label}</span></div>{node.children && expanded.has(node.id) && node.children.map(child => renderNode(child, level + 1))}</div>);
  return <div className="text-sm">{data.map(node => renderNode(node))}</div>;
}
export default TreeView;
