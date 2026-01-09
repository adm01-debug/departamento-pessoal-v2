import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface Permission { id: string; name: string; actions: { view: boolean; create: boolean; edit: boolean; delete: boolean }; }
interface PermissionMatrixProps { permissions: Permission[]; onToggle: (permissionId: string, action: string, value: boolean) => void; className?: string; }

export function PermissionMatrix({ permissions, onToggle, className }: PermissionMatrixProps) {
  const actions = ["view", "create", "edit", "delete"];
  const actionLabels = { view: "Ver", create: "Criar", edit: "Editar", delete: "Excluir" };

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="grid grid-cols-5 bg-muted text-sm font-medium">
        <div className="p-3">Permissão</div>
        {actions.map((action) => <div key={action} className="p-3 text-center">{actionLabels[action as keyof typeof actionLabels]}</div>)}
      </div>
      {permissions.map((perm) => (
        <div key={perm.id} className="grid grid-cols-5 border-t">
          <div className="p-3 text-sm font-medium">{perm.name}</div>
          {actions.map((action) => (
            <div key={action} className="p-3 flex justify-center">
              <Checkbox checked={perm.actions[action as keyof typeof perm.actions]} onCheckedChange={(checked) => onToggle(perm.id, action, checked as boolean)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
export default PermissionMatrix;
