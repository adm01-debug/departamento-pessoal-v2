import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Type, Palette } from "lucide-react";

interface CalendarEvent { id?: string; title: string; start: Date; end?: Date; color?: string; location?: string; description?: string; type?: string; }
interface EventModalProps { open: boolean; onOpenChange: (open: boolean) => void; event?: CalendarEvent; onSave: (event: CalendarEvent) => void; onDelete?: (id: string) => void; }

const COLORS = [{ value: "#3b82f6", label: "Azul" }, { value: "#10b981", label: "Verde" }, { value: "#f59e0b", label: "Amarelo" }, { value: "#ef4444", label: "Vermelho" }, { value: "#8b5cf6", label: "Roxo" }];

export function EventModal({ open, onOpenChange, event, onSave, onDelete }: EventModalProps) {
  const [data, setData] = useState<CalendarEvent>(event || { title: "", start: new Date(), color: "#3b82f6" });
  const handleSave = () => { onSave(data); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle>{event?.id ? "Editar Evento" : "Novo Evento"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label className="flex items-center gap-2"><Type className="h-4 w-4" />Título</Label><Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} placeholder="Nome do evento" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label className="flex items-center gap-2"><Calendar className="h-4 w-4" />Data Início</Label><Input type="datetime-local" value={data.start.toISOString().slice(0, 16)} onChange={e => setData({ ...data, start: new Date(e.target.value) })} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-2"><Clock className="h-4 w-4" />Data Fim</Label><Input type="datetime-local" value={data.end?.toISOString().slice(0, 16) || ""} onChange={e => setData({ ...data, end: e.target.value ? new Date(e.target.value) : undefined })} /></div>
          </div>
          <div className="space-y-2"><Label className="flex items-center gap-2"><MapPin className="h-4 w-4" />Local</Label><Input value={data.location || ""} onChange={e => setData({ ...data, location: e.target.value })} placeholder="Local do evento" /></div>
          <div className="space-y-2"><Label className="flex items-center gap-2"><Palette className="h-4 w-4" />Cor</Label><Select value={data.color} onValueChange={v => setData({ ...data, color: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COLORS.map(c => <SelectItem key={c.value} value={c.value}><div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: c.value }} />{c.label}</div></SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={data.description || ""} onChange={e => setData({ ...data, description: e.target.value })} placeholder="Detalhes do evento" rows={3} /></div>
        </div>
        <DialogFooter className="flex justify-between">
          {event?.id && onDelete && <Button variant="destructive" onClick={() => { onDelete(event.id!); onOpenChange(false); }}>Excluir</Button>}
          <div className="flex gap-2"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={handleSave}>Salvar</Button></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EventModal;
