import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Settings, Trash2 } from "lucide-react";

interface RoleCardProps { name: string; description?: string; userCount: number; permissionCount: number; isSystem?: boolean; onEdit?: () => void; onDelete?: () => void; onClick?: () => void; className?: string; }

export function RoleCard({ name, description, userCount, permissionCount, isSystem = false, onEdit, onDelete, onClick, className }: RoleCardProps) {
  return (
    <Card className={cn("cursor-pointer hover:shadow-md transition-shadow", className)} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /><CardTitle className="text-base">{name}</CardTitle>{isSystem && <Badge variant="secondary">Sistema</Badge>}</div>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-4 w-4" />{userCount} usuários</span>
          <span className="flex items-center gap-1"><Shield className="h-4 w-4" />{permissionCount} permissões</span>
        </div>
        {!isSystem && (onEdit || onDelete) && (
          <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            {onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Settings className="h-4 w-4 mr-1" />Editar</Button>}
            {onDelete && <Button variant="ghost" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4 mr-1" />Excluir</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default RoleCard;
