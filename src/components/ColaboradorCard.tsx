// V14-025: ColaboradorCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, Building, Briefcase, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Colaborador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: "ativo" | "ferias" | "afastado" | "desligado";
  avatarUrl?: string;
}

interface ColaboradorCardProps {
  colaborador: Colaborador;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  ativo: { label: "Ativo", variant: "default" as const },
  ferias: { label: "Férias", variant: "secondary" as const },
  afastado: { label: "Afastado", variant: "outline" as const },
  desligado: { label: "Desligado", variant: "destructive" as const },
};

export function ColaboradorCard({ colaborador, onView, onEdit, onDelete }: ColaboradorCardProps) {
  const initials = colaborador.nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const status = statusConfig[colaborador.status];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={colaborador.avatarUrl} alt={colaborador.nome} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{colaborador.nome}</h3>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView?.(colaborador.id)}>Visualizar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(colaborador.id)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete?.(colaborador.id)} className="text-destructive">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-4 w-4" />
          <span>{colaborador.cargo}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building className="h-4 w-4" />
          <span>{colaborador.departamento}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{colaborador.email}</span>
        </div>
        {colaborador.telefone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{colaborador.telefone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Admissão: {new Date(colaborador.dataAdmissao).toLocaleDateString("pt-BR")}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onView?.(colaborador.id)}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

