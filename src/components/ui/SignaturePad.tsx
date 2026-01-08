import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eraser, Download, Undo, Save } from "lucide-react";

interface SignaturePadProps {
  className?: string;
  width?: number;
  height?: number;
  penColor?: string;
  penWidth?: number;
  backgroundColor?: string;
  onSave?: (dataUrl: string, blob: Blob) => void;
  onClear?: () => void;
}

export function SignaturePad({ className, width = 400, height = 200, penColor = "#000000", penWidth = 2, backgroundColor = "#ffffff", onSave, onClear }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [width, height, penColor, penWidth, backgroundColor]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    historyRef.current.push(ctx.getImageData(0, 0, width, height));
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => { setIsDrawing(false); };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    setIsEmpty(true);
    historyRef.current = [];
    onClear?.();
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || historyRef.current.length === 0) return;
    const lastState = historyRef.current.pop();
    if (lastState) ctx.putImageData(lastState, 0, 0);
    if (historyRef.current.length === 0) setIsEmpty(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    canvas.toBlob((blob) => { if (blob) onSave?.(dataUrl, blob); }, "image/png");
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <canvas ref={canvasRef} width={width} height={height} className="border rounded-lg cursor-crosshair touch-none" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" onClick={undo} disabled={isEmpty}><Undo className="h-4 w-4 mr-1" />Desfazer</Button>
        <Button variant="outline" size="sm" onClick={clear} disabled={isEmpty}><Eraser className="h-4 w-4 mr-1" />Limpar</Button>
        <Button variant="default" size="sm" onClick={handleSave} disabled={isEmpty}><Save className="h-4 w-4 mr-1" />Salvar</Button>
      </div>
    </div>
  );
}
export default SignaturePad;
