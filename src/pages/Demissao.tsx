import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { UserMinus, FileText, Calculator, Calendar, AlertTriangle, CheckCircle, Clock, Download } from "lucide-react";

interface Demissao {
  id: string;
  colaboradorId: string;
  colaboradorNome: string;
  tipo: "sem_justa_causa" | "com_justa_causa" | "pedido_demissao" | "acordo";
  dataAviso: string;
  dataDesligamento: string;
  status: "pendente" | "em_processamento" | "homologacao" | "concluido";
  motivoDetalhado?: string;
  valorRescisao?: number;
}

const tiposDemissao = [
  { value: "sem_justa_causa", label: "Sem Justa Causa", color: "bg-blue-500" },
  { value: "com_justa_causa", label: "Com Justa Causa", color: "bg-red-500" },
  { value: "pedido_demissao", label: "Pedido de Demissão", color: "bg-yellow-500" },
  { value: "acordo", label: "Acordo (Art. 484-A)", color: "bg-purple-500" },
];

export default function Demissao() {
  const { toast } = useToast();
  const [demissoes, setDemissoes] = useState<Demissao[]>([
    { id: "1", colaboradorId: "1", colaboradorNome: "João Silva", tipo: "sem_justa_causa", dataAviso: "2026-01-01", dataDesligamento: "2026-01-31", status: "em_processamento", valorRescisao: 15420.50 },
    { id: "2", colaboradorId: "2", colaboradorNome: "Maria Santos", tipo: "pedido_demissao", dataAviso: "2026-01-05", dataDesligamento: "2026-02-04", status: "pendente" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaDemsisao, setNovaDemissao] = useState({ colaboradorId: "", tipo: "", dataAviso: "", motivoDetalhado: "" });

  const handleNovaDemissao = () => {
    const demissao: Demissao = {
      id: crypto.randomUUID(),
      colaboradorId: novaDemsisao.colaboradorId,
      colaboradorNome: "Novo Colaborador",
      tipo: novaDemsisao.tipo as any,
      dataAviso: novaDemsisao.dataAviso,
      dataDesligamento: new Date(new Date(novaDemsisao.dataAviso).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pendente",
      motivoDetalhado: novaDemsisao.motivoDetalhado,
    };
    setDemissoes([demissao, ...demissoes]);
    setIsDialogOpen(false);
    toast({ title: "Demissão registrada", description: "Processo de desligamento iniciado com sucesso." });
  };

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pendente: { label: "Pendente", variant: "outline" },
      em_processamento: { label: "Em Processamento", variant: "secondary" },
      homologacao: { label: "Homologação", variant: "default" },
      concluido: { label: "Concluído", variant: "default" },
    };
    const config = configs[status] || configs.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><UserMinus className="h-8 w-8" /> Gestão de Demissões</h1>
          <p className="text-muted-foreground">Gerencie processos de desligamento e rescisões</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button><UserMinus className="mr-2 h-4 w-4" /> Nova Demissão</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Registrar Nova Demissão</DialogTitle><DialogDescription>Preencha os dados para iniciar o processo de desligamento</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Colaborador</Label><Select onValueChange={v => setNovaDemissao({ ...novaDemsisao, colaboradorId: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="1">João Silva</SelectItem><SelectItem value="2">Maria Santos</SelectItem></SelectContent></Select></div>
                <div><Label>Tipo de Demissão</Label><Select onValueChange={v => setNovaDemissao({ ...novaDemsisao, tipo: v })}><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent>{tiposDemissao.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div><Label>Data do Aviso</Label><Input type="date" value={novaDemsisao.dataAviso} onChange={e => setNovaDemissao({ ...novaDemsisao, dataAviso: e.target.value })} /></div>
              <div><Label>Motivo Detalhado</Label><Textarea value={novaDemsisao.motivoDetalhado} onChange={e => setNovaDemissao({ ...novaDemsisao, motivoDetalhado: e.target.value })} placeholder="Descreva o motivo do desligamento..." /></div>
              <Button onClick={handleNovaDemissao}>Registrar Demissão</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Mês</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{demissoes.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pendentes</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-yellow-600">{demissoes.filter(d => d.status === "pendente").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Em Processo</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{demissoes.filter(d => d.status === "em_processamento").length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Concluídos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{demissoes.filter(d => d.status === "concluido").length}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Processos de Demissão</CardTitle><CardDescription>Lista de desligamentos em andamento e concluídos</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Colaborador</TableHead><TableHead>Tipo</TableHead><TableHead>Data Aviso</TableHead><TableHead>Desligamento</TableHead><TableHead>Valor Rescisão</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {demissoes.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.colaboradorNome}</TableCell>
                  <TableCell><Badge variant="outline">{tiposDemissao.find(t => t.value === d.tipo)?.label}</Badge></TableCell>
                  <TableCell>{new Date(d.dataAviso).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{new Date(d.dataDesligamento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{d.valorRescisao?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) || "-"}</TableCell>
                  <TableCell>{getStatusBadge(d.status)}</TableCell>
                  <TableCell><div className="flex gap-2"><Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button><Button variant="ghost" size="sm"><Calculator className="h-4 w-4" /></Button><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></div></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
