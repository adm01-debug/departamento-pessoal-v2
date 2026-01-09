import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";

interface PhotoCaptureProps { value?: string; onChange?: (dataUrl: string | null) => void; width?: number; height?: number; className?: string; }

export function PhotoCapture({ value, onChange, width = 320, height = 240, className }: PhotoCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width, height } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setIsStreaming(true); }
    } catch (err) { console.error("Erro ao acessar câmera:", err); }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, width, height);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      onChange?.(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      setIsStreaming(false);
    }
  };

  const reset = () => { onChange?.(null); };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative border rounded overflow-hidden bg-muted" style={{ width, height }}>
        {value ? <img src={value} alt="Captured" className="w-full h-full object-cover" /> : isStreaming ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-muted-foreground"><Camera className="h-12 w-12" /></div>}
      </div>
      <canvas ref={canvasRef} width={width} height={height} className="hidden" />
      <div className="flex gap-2">
        {value ? (
          <><Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4 mr-2" />Nova foto</Button><Button><Check className="h-4 w-4 mr-2" />Usar foto</Button></>
        ) : isStreaming ? (
          <Button onClick={capture}><Camera className="h-4 w-4 mr-2" />Capturar</Button>
        ) : (
          <Button onClick={startCamera}><Camera className="h-4 w-4 mr-2" />Abrir câmera</Button>
        )}
      </div>
    </div>
  );
}
export default PhotoCapture;
