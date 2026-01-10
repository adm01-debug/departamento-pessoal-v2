// V14-039: EmpresaCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Mail, Users, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Empresa {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  endereco: string;
  telefone?: string;
  email?: string;
  colaboradoresCount: number;
  ativa: boolean;
}

interface EmpresaCardProps {
  empresa: Empresa;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function EmpresaCard({ empresa, onView, onEdit, onDelete, onSelect }: EmpresaCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{empresa.nomeFantasia || empresa.razaoSocial}</h3>
            <p className="text-sm text-muted-foreground">{empresa.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={empresa.ativa ? "default" : "secondary"}>{empresa.ativa ? "Ativa" : "Inativa"}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onSelect?.(empresa.id)}>Selecionar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onView?.(empresa.id)}>Visualizar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(empresa.id)}>Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(empresa.id)} className="text-destructive">Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span className="truncate">{empresa.endereco}</span></div>
        {empresa.telefone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /><span>{empresa.telefone}</span></div>}
        {empresa.email && <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /><span className="truncate">{empresa.email}</span></div>}
        <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /><span>{empresa.colaboradoresCount} colaboradores</span></div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onSelect?.(empresa.id)}>Selecionar Empresa</Button>
      </CardFooter>
    </Card>
  );
}

