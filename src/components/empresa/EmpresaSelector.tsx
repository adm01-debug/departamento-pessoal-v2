import { memo, useState } from 'react';
import { Building2, Check, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEmpresas } from "@/hooks/useEmpresas";
import { Badge } from "@/components/ui/badge";
import { EmpresaModal } from "./EmpresaModal";

export const EmpresaSelector = memo(function EmpresaSelector() {
  const { userEmpresas, empresaAtual, trocarEmpresa, temMultiplasEmpresas } = useEmpresas();
  const [modalOpen, setModalOpen] = useState(false);

  if (!userEmpresas || userEmpresas.length === 0) {
    return (
      <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>
        <Building2 className="h-4 w-4 mr-2" />
        Configurar Empresa
      </Button>
    );
  }

  if (!temMultiplasEmpresas && empresaAtual) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium truncate max-w-[150px]">
          {empresaAtual.nome_fantasia || empresaAtual.razao_social}
        </span>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate max-w-[120px]">
              {empresaAtual?.nome_fantasia || empresaAtual?.razao_social || "Selecionar"}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          {userEmpresas.map((ue) => (
            <DropdownMenuItem
              key={ue.empresa_id}
              onClick={() => trocarEmpresa(ue.empresa_id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">
                  {ue.empresa?.nome_fantasia || ue.empresa?.razao_social}
                </span>
              </div>
              {ue.empresa_id === empresaAtual?.id && (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              )}
              {ue.is_default && (
                <Badge variant="secondary" className="text-[10px] px-1 flex-shrink-0">
                  Padrão
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Gerenciar Empresas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EmpresaModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
});