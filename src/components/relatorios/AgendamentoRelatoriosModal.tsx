import { useState, memo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAgendamentoRelatorios,
  TIPOS_RELATORIO,
  DIAS_SEMANA,
  type Frequencia,
  type RelatorioAgendado,
} from "@/hooks/useAgendamentoRelatorios";
import {
  Calendar,
  Clock,
  Mail,
  Play,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AgendamentoRelatoriosModal = memo(function AgendamentoRelatoriosModal({ open, onOpenChange }: Props) {
  const {
    agendamentos,
    logs,
    isLoading,
    criarAgendamento,
    excluirAgendamento,
    alternarAtivo,
    executarAgora,
  } = useAgendamentoRelatorios();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    tipo_relatorio: "",
    formato: "PDF",
    email_destinatario: "",
    frequencia: "diario" as Frequencia,
    dia_semana: 1,
    dia_mes: 1,
    hora_envio: "08:00",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await criarAgendamento({
        nome: form.nome,
        tipo_relatorio: form.tipo_relatorio,
        formato: form.formato,
        email_destinatario: form.email_destinatario,
        frequencia: form.frequencia,
        dia_semana: form.frequencia === "semanal" ? form.dia_semana : undefined,
        dia_mes: form.frequencia === "mensal" ? form.dia_mes : undefined,
        hora_envio: form.hora_envio,
      });

      setMostrarFormulario(false);
      setForm({
        nome: "",
        tipo_relatorio: "",
        formato: "PDF",
        email_destinatario: "",
        frequencia: "diario",
        dia_semana: 1,
        dia_mes: 1,
        hora_envio: "08:00",
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const getFrequenciaLabel = (agendamento: RelatorioAgendado) => {
    switch (agendamento.frequencia) {
      case "diario":
        return `Diário às ${agendamento.hora_envio?.slice(0, 5)}`;
      case "semanal":
        const dia = DIAS_SEMANA.find(d => d.value === agendamento.dia_semana);
        return `${dia?.label} às ${agendamento.hora_envio?.slice(0, 5)}`;
      case "mensal":
        return `Dia ${agendamento.dia_mes} às ${agendamento.hora_envio?.slice(0, 5)}`;
      default:
        return agendamento.frequencia;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sucesso":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "erro":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamento de Relatórios
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="agendamentos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="historico">Histórico de Envios</TabsTrigger>
          </TabsList>

          <TabsContent value="agendamentos" className="space-y-4">
            {!mostrarFormulario ? (
              <>
                <div className="flex justify-end">
                  <Button onClick={() => setMostrarFormulario(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>

                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </div>
                  ) : agendamentos?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum agendamento configurado
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Relatório</TableHead>
                          <TableHead>Frequência</TableHead>
                          <TableHead>Destinatário</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {agendamentos?.map((agendamento) => (
                          <TableRow key={agendamento.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{agendamento.nome}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {TIPOS_RELATORIO.find(t => t.value === agendamento.tipo_relatorio)?.label}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {getFrequenciaLabel(agendamento)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{agendamento.email_destinatario}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={agendamento.ativo}
                                  onCheckedChange={(checked) =>
                                    alternarAtivo(agendamento.id, checked)
                                  }
                                />
                                <Badge variant={agendamento.ativo ? "default" : "secondary"}>
                                  {agendamento.ativo ? "Ativo" : "Pausado"}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => executarAgora(agendamento.id)}
                                  title="Executar agora"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => excluirAgendamento(agendamento.id)}
                                  className="text-destructive"
                                  title="Excluir"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Agendamento</Label>
                    <Input
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      placeholder="Ex: Relatório Semanal de Colaboradores"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select
                      value={form.tipo_relatorio}
                      onValueChange={(value) => setForm({ ...form, tipo_relatorio: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o relatório" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_RELATORIO.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Destinatário</Label>
                    <Input
                      type="email"
                      value={form.email_destinatario}
                      onChange={(e) => setForm({ ...form, email_destinatario: e.target.value })}
                      placeholder="email@empresa.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Formato</Label>
                    <Select
                      value={form.formato}
                      onValueChange={(value) => setForm({ ...form, formato: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="CSV">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequência</Label>
                    <Select
                      value={form.frequencia}
                      onValueChange={(value) => setForm({ ...form, frequencia: value as Frequencia })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {form.frequencia === "semanal" && (
                    <div className="space-y-2">
                      <Label>Dia da Semana</Label>
                      <Select
                        value={String(form.dia_semana)}
                        onValueChange={(value) => setForm({ ...form, dia_semana: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DIAS_SEMANA.map((dia) => (
                            <SelectItem key={dia.value} value={String(dia.value)}>
                              {dia.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {form.frequencia === "mensal" && (
                    <div className="space-y-2">
                      <Label>Dia do Mês</Label>
                      <Select
                        value={String(form.dia_mes)}
                        onValueChange={(value) => setForm({ ...form, dia_mes: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                            <SelectItem key={dia} value={String(dia)}>
                              Dia {dia}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Hora de Envio</Label>
                    <Input
                      type="time"
                      value={form.hora_envio}
                      onChange={(e) => setForm({ ...form, hora_envio: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Salvar Agendamento
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value="historico">
            <ScrollArea className="h-[400px]">
              {logs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum envio registrado
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mensagem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge
                              variant={
                                log.status === "sucesso"
                                  ? "default"
                                  : log.status === "erro"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {log.mensagem || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});