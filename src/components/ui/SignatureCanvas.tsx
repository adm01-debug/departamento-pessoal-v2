import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

interface SignatureCanvasProps { onSave: (data: string) => void; className?: string; }

export function SignatureCanvas({ onSave, className }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const getCtx = () => canvasRef.current?.getContext("2d");
  const startDraw = (e: React.MouseEvent) => { setDrawing(true); const ctx = getCtx(); if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); } };
  const draw = (e: React.MouseEvent) => { if (!drawing) return; const ctx = getCtx(); if (ctx) { ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); } };
  const clear = () => { const ctx = getCtx(); if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };
  return (
    <div className={cn("space-y-2", className)}>
      <canvas ref={canvasRef} width={400} height={200} className="border rounded-lg cursor-crosshair bg-white" onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setDrawing(false)} onMouseLeave={() => setDrawing(false)} />
      <div className="flex gap-2"><Button variant="outline" onClick={clear}><Eraser className="h-4 w-4 mr-2" />Limpar</Button><Button onClick={() => onSave(canvasRef.current?.toDataURL() || "")}>Salvar</Button></div>
    </div>
  );
}
export default SignatureCanvas;
