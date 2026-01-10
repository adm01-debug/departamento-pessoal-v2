// V14-026: ColaboradorDetails.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, FileText, Calendar, DollarSign, Clock, Award, Users, Building } from "lucide-react";

interface ColaboradorDetailsProps {
  colaborador: {
    id: string;
    nome: string;
    cpf: string;
    rg?: string;
    dataNascimento: string;
    email: string;
    telefone?: string;
    cargo: string;
    departamento: string;
    dataAdmissao: string;
    salario: number;
    status: "ativo" | "ferias" | "afastado" | "desligado";
    avatarUrl?: string;
    endereco?: {
      rua: string;
      numero: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    };
  };
  onEdit?: () => void;
}

const statusConfig = {
  ativo: { label: "Ativo", variant: "default" as const },
  ferias: { label: "Férias", variant: "secondary" as const },
  afastado: { label: "Afastado", variant: "outline" as const },
  desligado: { label: "Desligado", variant: "destructive" as const },
};

export function ColaboradorDetails({ colaborador, onEdit }: ColaboradorDetailsProps) {
  const initials = colaborador.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const status = statusConfig[colaborador.status];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={colaborador.avatarUrl} alt={colaborador.nome} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{colaborador.nome}</h1>
            <p className="text-muted-foreground">{colaborador.cargo}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={status.variant}>{status.label}</Badge>
              <Badge variant="outline">{colaborador.departamento}</Badge>
            </div>
          </div>
        </div>
        {onEdit && (
          <Button onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="profissional">Profissional</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div><span className="text-muted-foreground">CPF:</span> {colaborador.cpf}</div>
                {colaborador.rg && <div><span className="text-muted-foreground">RG:</span> {colaborador.rg}</div>}
                <div><span className="text-muted-foreground">Nascimento:</span> {formatDate(colaborador.dataNascimento)}</div>
                <div><span className="text-muted-foreground">Email:</span> {colaborador.email}</div>
                {colaborador.telefone && <div><span className="text-muted-foreground">Telefone:</span> {colaborador.telefone}</div>}
              </CardContent>
            </Card>

            {colaborador.endereco && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>{colaborador.endereco.rua}, {colaborador.endereco.numero}</div>
                  <div>{colaborador.endereco.bairro}</div>
                  <div>{colaborador.endereco.cidade} - {colaborador.endereco.estado}</div>
                  <div><span className="text-muted-foreground">CEP:</span> {colaborador.endereco.cep}</div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profissional" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admissão</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDate(colaborador.dataAdmissao)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salário</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(colaborador.salario)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departamento</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{colaborador.departamento}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle>Documentos</CardTitle>
              <CardDescription>Documentos anexados ao cadastro</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhum documento cadastrado</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico</CardTitle>
              <CardDescription>Alterações e eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhum registro de histórico</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

