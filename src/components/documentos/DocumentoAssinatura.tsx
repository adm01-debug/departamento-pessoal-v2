import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool, Upload, Check, X, FileSignature, Download } from "lucide-react";

interface Assinatura {
  tipo: "desenho" | "upload" | "digital";
  dados: string;
  dataAssinatura: string;
  ip?: string;
  hash?: string;
}

interface DocumentoAssinaturaProps {
  documentoId: string;
  documentoNome: string;
  assinaturaExistente?: Assinatura;
  onAssinar: (assinatura: Assinatura) => void;
  onCancelar?: () => void;
  readOnly?: boolean;
}

export function DocumentoAssinatura({
  documentoId,
  documentoNome,
  assinaturaExistente,
  onAssinar,
  onCancelar,
  readOnly = false
}: DocumentoAssinaturaProps) {
  const [modo, setModo] = useState<"desenho" | "upload" | "digital">("desenho");
  const [assinatura, setAssinatura] = useState<string>("");
  const [desenhando, setDesenhando] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);

  const iniciarDesenho = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    setDesenhando(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const desenhar = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!desenhando || readOnly) return;
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

  const finalizarDesenho = () => {
    setDesenhando(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setAssinatura(canvas.toDataURL("image/png"));
    }
  };

  const limparCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAssinatura("");
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivo(file);
      const reader = new FileReader();
      reader.onload = () => setAssinatura(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const confirmarAssinatura = () => {
    if (!assinatura) return;
    onAssinar({
      tipo: modo,
      dados: assinatura,
      dataAssinatura: new Date().toISOString(),
      hash: btoa(assinatura.substring(0, 100))
    });
  };

  if (assinaturaExistente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Documento Assinado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-green-500">
                <Check className="h-3 w-3 mr-1" /> Assinado
              </Badge>
              <span className="text-sm text-muted-foreground">
                em {new Date(assinaturaExistente.dataAssinatura).toLocaleString("pt-BR")}
              </span>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <img src={assinaturaExistente.dados} alt="Assinatura" className="max-h-20" />
            </div>
            {assinaturaExistente.hash && (
              <p className="text-xs text-muted-foreground">Hash: {assinaturaExistente.hash}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Assinar Documento
        </CardTitle>
        <p className="text-sm text-muted-foreground">{documentoNome}</p>
      </CardHeader>
      <CardContent>
        <Tabs value={modo} onValueChange={(v) => setModo(v as typeof modo)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="desenho">Desenhar</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="desenho" className="space-y-4">
            <div className="border rounded-lg p-2 bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="border border-dashed cursor-crosshair w-full"
                onMouseDown={iniciarDesenho}
                onMouseMove={desenhar}
                onMouseUp={finalizarDesenho}
                onMouseLeave={finalizarDesenho}
              />
            </div>
            <Button variant="outline" size="sm" onClick={limparCanvas}>
              Limpar
            </Button>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label>Selecione uma imagem da sua assinatura</Label>
              <Input type="file" accept="image/*" onChange={handleUpload} className="mt-2" />
            </div>
            {assinatura && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <img src={assinatura} alt="Preview" className="max-h-20" />
              </div>
            )}
          </TabsContent>

          <TabsContent value="digital" className="space-y-4">
            <div>
              <Label>Certificado Digital (A1/A3)</Label>
              <Input type="file" accept=".pfx,.p12" className="mt-2" />
              <Input type="password" placeholder="Senha do certificado" className="mt-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              A assinatura digital utiliza seu certificado ICP-Brasil
            </p>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          {onCancelar && (
            <Button variant="outline" onClick={onCancelar}>
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
          )}
          <Button onClick={confirmarAssinatura} disabled={!assinatura}>
            <Check className="h-4 w-4 mr-2" /> Assinar Documento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentoAssinatura;
