import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pencil, Eraser, Square, Circle, Type, Trash2, Download, Undo, Redo } from "lucide-react";

type Tool = "pen" | "eraser" | "rectangle" | "circle" | "text";

interface WhiteboardProps {
  className?: string;
  width?: number;
  height?: number;
  onSave?: (dataUrl: string) => void;
}

export function Whiteboard({ className, width = 800, height = 600, onSave }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    saveToHistory();
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, width, height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const getCoordinates = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || (tool !== "pen" && tool !== "eraser")) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => { setIsDrawing(false); saveToHistory(); };

  const undo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(history[historyIndex - 1], 0, 0);
    setHistoryIndex(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(history[historyIndex + 1], 0, 0);
    setHistoryIndex(historyIndex + 1);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    saveToHistory();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave?.(canvas.toDataURL("image/png"));
  };

  const colors = ["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg flex-wrap">
        <Button variant={tool === "pen" ? "default" : "outline"} size="icon" onClick={() => setTool("pen")}><Pencil className="h-4 w-4" /></Button>
        <Button variant={tool === "eraser" ? "default" : "outline"} size="icon" onClick={() => setTool("eraser")}><Eraser className="h-4 w-4" /></Button>
        <div className="w-px h-6 bg-border" />
        <div className="flex gap-1">
          {colors.map(c => (
            <button key={c} className={cn("w-6 h-6 rounded-full border-2", color === c ? "border-primary" : "border-transparent")} style={{ backgroundColor: c }} onClick={() => setColor(c)} />
          ))}
        </div>
        <div className="w-px h-6 bg-border" />
        <div className="flex items-center gap-2 w-32">
          <span className="text-xs">Tamanho:</span>
          <Slider value={[brushSize]} min={1} max={20} step={1} onValueChange={([v]) => setBrushSize(v)} />
        </div>
        <div className="w-px h-6 bg-border" />
        <Button variant="outline" size="icon" onClick={undo} disabled={historyIndex <= 0}><Undo className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}><Redo className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={clear}><Trash2 className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={handleSave}><Download className="h-4 w-4" /></Button>
      </div>
      <canvas ref={canvasRef} width={width} height={height} className="border rounded-lg cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
    </div>
  );
}
export default Whiteboard;
