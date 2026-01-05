import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useColaborador } from "@/queries/colaboradoresQueries";
import { useFeriasColaborador } from "@/queries/feriasQueries";
import { Edit, Calendar, DollarSign, FileText, Clock } from "lucide-react";
export function ColaboradorDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const { data: colaborador, isLoading } = useColaborador(id!);
  const { data: ferias } = useFeriasColaborador(id!);
  if (isLoading) return <div>Carregando...</div>;
  if (!colaborador) return <div>Colaborador não encontrado</div>;
  return (<div className="space-y-6"><PageHeader title={colaborador.nome} description={`${colaborador.cargoId} - ${colaborador.departamentoId}`}><Button><Edit className="h-4 w-4 mr-2" />Editar</Button></PageHeader><Tabs defaultValue="dados"><TabsList><TabsTrigger value="dados">Dados Pessoais</TabsTrigger><TabsTrigger value="contrato">Contrato</TabsTrigger><TabsTrigger value="ferias">Férias</TabsTrigger><TabsTrigger value="historico">Histórico</TabsTrigger></TabsList><TabsContent value="dados"><Card><CardContent className="p-6"><div className="flex gap-6"><UserAvatar name={colaborador.nome} size="lg" /><div className="grid grid-cols-3 gap-4 flex-1"><div><span className="text-sm text-muted-foreground">CPF</span><p>{colaborador.cpf}</p></div><div><span className="text-sm text-muted-foreground">Email</span><p>{colaborador.email || "-"}</p></div><div><span className="text-sm text-muted-foreground">Status</span><Badge>{colaborador.status}</Badge></div></div></div></CardContent></Card></TabsContent><TabsContent value="ferias"><Card><CardContent className="p-6">{ferias?.map((f, i) => <div key={i} className="p-3 border rounded mb-2">{f.periodoAquisitivo} - {f.status}</div>)}</CardContent></Card></TabsContent></Tabs></div>);
}
export default ColaboradorDetalhePage;
