import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { FileText, Send, Save, Check, AlertTriangle, Clock, RefreshCw } from "lucide-react";

interface EventoS1000Data {
  id?: string;
  ideEvento?: { indRetif: string; nrRecibo?: string; tpAmb: string; procEmi: string; verProc: string };
  ideEmpregador?: { tpInsc: string; nrInsc: string };
  dados?: Record<string, any>;
  status?: "rascunho" | "validado" | "enviado" | "aceito" | "rejeitado";
  erros?: Array<{ campo: string; mensagem: string }>;
}

interface EventoS1000Props {
  data?: EventoS1000Data;
  onSave?: (data: EventoS1000Data) => void;
  onValidate?: (data: EventoS1000Data) => Promise<boolean>;
  onSend?: (data: EventoS1000Data) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export function EventoS1000({ data: initialData, onSave, onValidate, onSend, loading = false, className }: EventoS1000Props) {
  const [data, setData] = useState<EventoS1000Data>(initialData || { status: "rascunho" });
  const [activeTab, setActiveTab] = useState("identificacao");
  const [validating, setValidating] = useState(false);
  const [sending, setSending] = useState(false);

  const statusConfig = {
    rascunho: { label: "Rascunho", color: "bg-gray-100 text-gray-700", icon: Clock },
    validado: { label: "Validado", color: "bg-blue-100 text-blue-700", icon: Check },
    enviado: { label: "Enviado", color: "bg-yellow-100 text-yellow-700", icon: Send },
    aceito: { label: "Aceito", color: "bg-green-100 text-green-700", icon: Check },
    rejeitado: { label: "Rejeitado", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  };

  const handleChange = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleValidate = async () => {
    setValidating(true);
    try {
      const isValid = await onValidate?.(data);
      if (isValid) setData(prev => ({ ...prev, status: "validado", erros: [] }));
    } finally {
      setValidating(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend?.(data);
      setData(prev => ({ ...prev, status: "enviado" }));
    } finally {
      setSending(false);
    }
  };

  const StatusIcon = statusConfig[data.status || "rascunho"].icon;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />S1000 - Informações do Empregador
            </CardTitle>
            <CardDescription>Evento eSocial - Leiaute 1.1</CardDescription>
          </div>
          <Badge className={statusConfig[data.status || "rascunho"].color}>
            <StatusIcon className="h-3 w-3 mr-1" />{statusConfig[data.status || "rascunho"].label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="identificacao">Identificação</TabsTrigger>
            <TabsTrigger value="dados">Dados do Evento</TabsTrigger>
            <TabsTrigger value="validacao">Validação</TabsTrigger>
          </TabsList>

          <TabsContent value="identificacao" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Inscrição</Label>
                <Select value={data.ideEmpregador?.tpInsc || "1"} onValueChange={v => handleChange("ideEmpregador", { ...data.ideEmpregador, tpInsc: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">CNPJ</SelectItem>
                    <SelectItem value="2">CPF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Número de Inscrição</Label>
                <Input value={data.ideEmpregador?.nrInsc || ""} onChange={e => handleChange("ideEmpregador", { ...data.ideEmpregador, nrInsc: e.target.value })} placeholder="CNPJ/CPF" />
              </div>
              <div className="space-y-2">
                <Label>Ambiente</Label>
                <Select value={data.ideEvento?.tpAmb || "2"} onValueChange={v => handleChange("ideEvento", { ...data.ideEvento, tpAmb: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Produção</SelectItem>
                    <SelectItem value="2">Homologação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Indicador de Retificação</Label>
                <Select value={data.ideEvento?.indRetif || "1"} onValueChange={v => handleChange("ideEvento", { ...data.ideEvento, indRetif: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Original</SelectItem>
                    <SelectItem value="2">Retificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dados" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campo 1</Label>
                <Input placeholder="Preencha o campo" />
              </div>
              <div className="space-y-2">
                <Label>Campo 2</Label>
                <Input placeholder="Preencha o campo" />
              </div>
            </div>
            <Alert><AlertDescription>Preencha todos os campos obrigatórios do evento S1000.</AlertDescription></Alert>
          </TabsContent>

          <TabsContent value="validacao" className="space-y-4 mt-4">
            {data.erros && data.erros.length > 0 ? (
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {data.erros.map((erro, i) => (
                    <Alert key={i} variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription><strong>{erro.campo}:</strong> {erro.mensagem}</AlertDescription></Alert>
                  ))}
                </div>
              </ScrollArea>
            ) : data.status === "validado" ? (
              <Alert><Check className="h-4 w-4" /><AlertDescription>Evento validado com sucesso! Pronto para envio.</AlertDescription></Alert>
            ) : (
              <Alert><AlertDescription>Execute a validação para verificar os dados do evento.</AlertDescription></Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onSave?.(data)} disabled={loading}><Save className="h-4 w-4 mr-2" />Salvar Rascunho</Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleValidate} disabled={loading || validating}><RefreshCw className={cn("h-4 w-4 mr-2", validating && "animate-spin")} />Validar</Button>
          <Button onClick={handleSend} disabled={loading || sending || data.status !== "validado"}><Send className="h-4 w-4 mr-2" />Enviar</Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default EventoS1000;
