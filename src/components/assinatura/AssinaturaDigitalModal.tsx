import { memo, useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eraser, Check, X, Download, PenTool } from 'lucide-react';
import { toast } from 'sonner';

interface AssinaturaDigitalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documento: string;
  onAssinaturaSalva: (assinaturaBase64: string, dataAssinatura: string) => void;
}

export const AssinaturaDigitalModal = memo(function AssinaturaDigitalModal({
  open,
  onOpenChange,
  documento,
  onAssinaturaSalva,
}: AssinaturaDigitalModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1a1a2e';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [open]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const limparAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const salvarAssinatura = async () => {
    if (!hasSignature) {
      toast.error('Por favor, assine o documento antes de confirmar');
      return;
    }

    setConfirmando(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const assinaturaBase64 = canvas.toDataURL('image/png');
      const dataAssinatura = new Date().toISOString();

      await new Promise(resolve => setTimeout(resolve, 500));

      onAssinaturaSalva(assinaturaBase64, dataAssinatura);
      toast.success('Documento assinado com sucesso!');
      onOpenChange(false);
    } catch {
      toast.error('Erro ao salvar assinatura');
    } finally {
      setConfirmando(false);
    }
  };

  const baixarAssinatura = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const link = document.createElement('a');
    link.download = `assinatura_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Assinatura Digital
          </DialogTitle>
          <DialogDescription>
            Assine o documento abaixo com sua assinatura digital
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info do documento */}
          <div className="p-3 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium">Documento:</p>
            <p className="text-sm text-muted-foreground">{documento}</p>
          </div>

          {/* Área de assinatura */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Sua assinatura</p>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={limparAssinatura}
                  disabled={!hasSignature}
                >
                  <Eraser className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={baixarAssinatura}
                  disabled={!hasSignature}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
            
            <div className="border-2 border-dashed rounded-lg p-1 bg-white">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full touch-none cursor-crosshair rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Use o mouse ou toque para assinar
            </p>
          </div>

          {/* Termos */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
            <p className="text-muted-foreground">
              Ao assinar este documento, você concorda que esta assinatura digital 
              tem o mesmo valor legal que uma assinatura manuscrita, conforme 
              MP 2.200-2/2001 e Lei 14.063/2020.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={salvarAssinatura} 
            disabled={!hasSignature || confirmando}
          >
            <Check className="w-4 h-4 mr-2" />
            {confirmando ? 'Assinando...' : 'Confirmar Assinatura'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});