import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrgChartNodeProps { name: string; position: string; department?: string; avatar?: string; employeeCount?: number; onClick?: () => void; selected?: boolean; className?: string; }

export function OrgChartNode({ name, position, department, avatar, employeeCount, onClick, selected, className }: OrgChartNodeProps) {
  return (
    <Card className={cn("w-48 cursor-pointer hover:shadow-md transition-shadow", selected && "ring-2 ring-primary", className)} onClick={onClick}>
      <CardContent className="p-3 text-center">
        <Avatar className="h-12 w-12 mx-auto mb-2"><AvatarImage src={avatar} /><AvatarFallback>{name[0]}</AvatarFallback></Avatar>
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{position}</p>
        {department && <p className="text-xs text-primary mt-1">{department}</p>}
        {employeeCount !== undefined && <p className="text-xs text-muted-foreground mt-1">{employeeCount} subordinados</p>}
      </CardContent>
    </Card>
  );
}
export default OrgChartNode;
