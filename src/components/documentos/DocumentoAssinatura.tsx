import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenTool, Check, X, Upload, FileSignature, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assinatura {
  id: string;
  documento_id: string;
  assinante_nome: string;
  assinante_email: string;
  assinante_cpf: string;
  tipo: "digital" | "manuscrita" | "token";
  status: "pendente" | "assinado" | "recusado" | "expirado";
  data_assinatura?: string;
  ip_assinatura?: string;
  hash_assinatura?: string;
  certificado_digital?: string;
  observacoes?: string;
}

interface DocumentoAssinaturaProps {
  documentoId: string;
  documentoNome: string;
  assinaturas: Assinatura[];
  onSolicitar?: (dados: Partial<Assinatura>) => Promise<void>;
  onAssinar?: (assinaturaId: string, dados: { assinatura: string; tipo: string }) => Promise<void>;
  onRecusar?: (assinaturaId: string, motivo: string) => Promise<void>;
  usuarioAtual?: { nome: string; email: string; cpf: string };
  modoVisualizacao?: boolean;
}

export function DocumentoAssinatura({
  documentoId,
  documentoNome,
  assinaturas,
  onSolicitar,
  onAssinar,
  onRecusar,
  usuarioAtual,
  modoVisualizacao = false
}: DocumentoAssinaturaProps) {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [novoAssinante, setNovoAssinante] = useState({ nome: "", email: "", cpf: "" });
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusConfig = {
    pendente: { label: "Pendente", color: "bg-yellow-500", icon: Clock },
    assinado: { label: "Assinado", color: "bg-green-500", icon: Check },
    recusado: { label: "Recusado", color: "bg-red-500", icon: X },
    expirado: { label: "Expirado", color: "bg-gray-500", icon: AlertCircle }
  };

  const iniciarDesenho = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const desenhar = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const pararDesenho = () => setIsDrawing(false);

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSolicitar = async () => {
    if (!novoAssinante.nome || !novoAssinante.email) {
      toast({ title: "Erro", description: "Preencha nome e email", variant: "destructive" });
      return;
    }
    try {
      await onSolicitar?.({ ...novoAssinante, documento_id: documentoId, tipo: "digital", status: "pendente" });
      toast({ title: "Sucesso", description: "Solicitação de assinatura enviada" });
      setNovoAssinante({ nome: "", email: "", cpf: "" });
      setDialogOpen(false);
    } catch {
      toast({ title: "Erro", description: "Falha ao solicitar assinatura", variant: "destructive" });
    }
  };

  const handleAssinar = async (assinaturaId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const assinaturaBase64 = canvas.toDataURL("image/png");
    
    try {
      await onAssinar?.(assinaturaId, { assinatura: assinaturaBase64, tipo: "manuscrita" });
      toast({ title: "Sucesso", description: "Documento assinado com sucesso" });
      limparAssinatura();
    } catch {
      toast({ title: "Erro", description: "Falha ao assinar documento", variant: "destructive" });
    }
  };

  const handleRecusar = async (assinaturaId: string) => {
    if (!motivoRecusa) {
      toast({ title: "Erro", description: "Informe o motivo da recusa", variant: "destructive" });
      return;
    }
    try {
      await onRecusar?.(assinaturaId, motivoRecusa);
      toast({ title: "Sucesso", description: "Assinatura recusada" });
      setMotivoRecusa("");
    } catch {
      toast({ title: "Erro", description: "Falha ao recusar", variant: "destructive" });
    }
  };

  const minhaAssinaturaPendente = assinaturas.find(
    a => a.status === "pendente" && a.assinante_email === usuarioAtual?.email
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileSignature className="h-5 w-5" />
          Assinaturas - {documentoNome}
        </CardTitle>
        {!modoVisualizacao && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><PenTool className="h-4 w-4 mr-2" />Solicitar Assinatura</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Solicitar Assinatura</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Nome</Label><Input value={novoAssinante.nome} onChange={e => setNovoAssinante({ ...novoAssinante, nome: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={novoAssinante.email} onChange={e => setNovoAssinante({ ...novoAssinante, email: e.target.value })} /></div>
                <div><Label>CPF</Label><Input value={novoAssinante.cpf} onChange={e => setNovoAssinante({ ...novoAssinante, cpf: e.target.value })} /></div>
                <Button onClick={handleSolicitar} className="w-full">Enviar Solicitação</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {assinaturas.map(assinatura => {
          const config = statusConfig[assinatura.status];
          const StatusIcon = config.icon;
          return (
            <div key={assinatura.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Badge className={config.color}><StatusIcon className="h-3 w-3 mr-1" />{config.label}</Badge>
                <div>
                  <p className="font-medium">{assinatura.assinante_nome}</p>
                  <p className="text-sm text-muted-foreground">{assinatura.assinante_email}</p>
                </div>
              </div>
              {assinatura.data_assinatura && <p className="text-sm text-muted-foreground">{new Date(assinatura.data_assinatura).toLocaleString("pt-BR")}</p>}
            </div>
          );
        })}

        {minhaAssinaturaPendente && !modoVisualizacao && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3">Sua Assinatura</h4>
            <div className="border rounded-lg p-2 bg-white">
              <canvas ref={canvasRef} width={400} height={150} className="border cursor-crosshair w-full" onMouseDown={iniciarDesenho} onMouseMove={desenhar} onMouseUp={pararDesenho} onMouseLeave={pararDesenho} />
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={limparAssinatura}>Limpar</Button>
              <Button onClick={() => handleAssinar(minhaAssinaturaPendente.id)} className="flex-1"><Check className="h-4 w-4 mr-2" />Assinar</Button>
              <Dialog>
                <DialogTrigger asChild><Button variant="destructive"><X className="h-4 w-4 mr-2" />Recusar</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Recusar Assinatura</DialogTitle></DialogHeader>
                  <Textarea placeholder="Motivo da recusa" value={motivoRecusa} onChange={e => setMotivoRecusa(e.target.value)} />
                  <Button variant="destructive" onClick={() => handleRecusar(minhaAssinaturaPendente.id)}>Confirmar Recusa</Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {assinaturas.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma assinatura solicitada</p>}
      </CardContent>
    </Card>
  );
}

export default DocumentoAssinatura;
