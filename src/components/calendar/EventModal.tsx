import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Trash2, Save } from "lucide-react";
import { format } from "date-fns";

interface CalendarEvent { id?: string; title: string; start: Date; end?: Date; color?: string; location?: string; description?: string; type?: string; }
interface EventModalProps { open: boolean; onClose: () => void; event?: CalendarEvent; onSave?: (event: CalendarEvent) => void; onDelete?: (id: string) => void; mode?: "create" | "edit" | "view"; }

const COLORS = [{ value: "#3b82f6", label: "Azul" }, { value: "#10b981", label: "Verde" }, { value: "#f59e0b", label: "Amarelo" }, { value: "#ef4444", label: "Vermelho" }, { value: "#8b5cf6", label: "Roxo" }];

export function EventModal({ open, onClose, event, onSave, onDelete, mode = "create" }: EventModalProps) {
  const [data, setData] = useState<CalendarEvent>(event || { title: "", start: new Date(), color: "#3b82f6" });
  const isView = mode === "view";

  const handleSave = () => { onSave?.(data); onClose(); };
  const handleDelete = () => { if (event?.id) { onDelete?.(event.id); onClose(); } };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />{mode === "create" ? "Novo Evento" : mode === "edit" ? "Editar Evento" : "Detalhes do Evento"}</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label>Título</Label><Input value={data.title} onChange={e => setData({ ...data, title: e.target.value })} disabled={isView} placeholder="Nome do evento" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Data/Hora Início</Label><Input type="datetime-local" value={format(data.start, "yyyy-MM-dd\x27T\x27HH:mm")} onChange={e => setData({ ...data, start: new Date(e.target.value) })} disabled={isView} /></div>
            <div className="space-y-2"><Label>Data/Hora Fim</Label><Input type="datetime-local" value={data.end ? format(data.end, "yyyy-MM-dd\x27T\x27HH:mm") : ""} onChange={e => setData({ ...data, end: e.target.value ? new Date(e.target.value) : undefined })} disabled={isView} /></div>
          </div>
          <div className="space-y-2"><Label>Local</Label><Input value={data.location || ""} onChange={e => setData({ ...data, location: e.target.value })} disabled={isView} placeholder="Local do evento" /></div>
          <div className="space-y-2"><Label>Cor</Label><Select value={data.color} onValueChange={v => setData({ ...data, color: v })} disabled={isView}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COLORS.map(c => <SelectItem key={c.value} value={c.value}><div className="flex items-center gap-2"><div className="w-4 h-4 rounded" style={{ backgroundColor: c.value }} />{c.label}</div></SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={data.description || ""} onChange={e => setData({ ...data, description: e.target.value })} disabled={isView} placeholder="Detalhes do evento" /></div>
        </div>
        <DialogFooter>
          {event?.id && onDelete && <Button variant="destructive" onClick={handleDelete}><Trash2 className="h-4 w-4 mr-2" />Excluir</Button>}
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          {!isView && <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default EventModal;
