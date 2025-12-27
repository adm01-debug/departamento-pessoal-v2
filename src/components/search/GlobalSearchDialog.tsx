import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, FileText, Users, Settings } from 'lucide-react';
interface GlobalSearchDialogProps { open: boolean; onOpenChange: (open: boolean) => void; }
export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (!open) setQuery(''); }, [open]);
  return (<Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle className="sr-only">Busca Global</DialogTitle></DialogHeader><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar colaboradores, documentos, configurações..." className="pl-10" autoFocus /></div><div className="mt-4 space-y-2"><p className="text-xs text-muted-foreground uppercase tracking-wide">Atalhos</p><div className="grid gap-2"><div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"><Users className="h-4 w-4" /><span>Colaboradores</span></div><div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"><FileText className="h-4 w-4" /><span>Documentos</span></div><div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"><Settings className="h-4 w-4" /><span>Configurações</span></div></div></div></DialogContent></Dialog>);
}
