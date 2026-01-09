import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Building2, Users } from "lucide-react";

interface Department { id: string; name: string; employeeCount: number; children?: Department[]; }
interface DepartmentTreeProps { departments: Department[]; onSelect?: (id: string) => void; selectedId?: string; className?: string; }

function DepartmentNode({ dept, level, onSelect, selectedId }: { dept: Department; level: number; onSelect?: (id: string) => void; selectedId?: string }) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = dept.children && dept.children.length > 0;

  return (
    <div>
      <div className={cn("flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer", selectedId === dept.id && "bg-primary/10")} style={{ paddingLeft: `${level * 16 + 8}px` }} onClick={() => onSelect?.(dept.id)}>
        {hasChildren ? <Button variant="ghost" size="icon" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>{expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</Button> : <span className="w-5" />}
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-sm font-medium">{dept.name}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" />{dept.employeeCount}</span>
      </div>
      {expanded && hasChildren && dept.children!.map((child) => <DepartmentNode key={child.id} dept={child} level={level + 1} onSelect={onSelect} selectedId={selectedId} />)}
    </div>
  );
}

export function DepartmentTree({ departments, onSelect, selectedId, className }: DepartmentTreeProps) {
  return <div className={className}>{departments.map((dept) => <DepartmentNode key={dept.id} dept={dept} level={0} onSelect={onSelect} selectedId={selectedId} />)}</div>;
}
export default DepartmentTree;
