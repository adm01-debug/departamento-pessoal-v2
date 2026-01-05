import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, AlertCircle, Info, Calendar, FileText } from "lucide-react";
import { useNotificacao } from "@/hooks/useNotificacao";
const TIPO_ICONS: Record<string, any> = { SISTEMA: Bell, TAREFA: FileText, ALERTA: AlertCircle, LEMBRETE: Calendar, APROVACAO: Check, INFO: Info };
export function NotificacaoDropdown({ usuarioId }: { usuarioId: string }) {
  const { notificacoes, quantidadeNaoLidas, marcarLida, marcarTodasLidas } = useNotificacao(usuarioId);
  return (
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="relative"><Bell className="w-5 h-5" />{quantidadeNaoLidas > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{quantidadeNaoLidas}</Badge>}</Button></DropdownMenuTrigger>
    <DropdownMenuContent className="w-80" align="end">
      <div className="flex justify-between items-center p-2"><span className="font-semibold">Notificações</span>{quantidadeNaoLidas > 0 && <Button variant="ghost" size="sm" onClick={() => marcarTodasLidas()}>Marcar todas como lidas</Button>}</div>
      <DropdownMenuSeparator />
      {notificacoes.slice(0, 5).map((n: any) => { const Icon = TIPO_ICONS[n.tipo] || Bell; return <DropdownMenuItem key={n.id} onClick={() => marcarLida(n.id)} className={!n.lida ? "bg-blue-50" : ""}><div className="flex gap-2"><Icon className="w-4 h-4 mt-0.5" /><div><p className="font-medium text-sm">{n.titulo}</p><p className="text-xs text-muted-foreground line-clamp-1">{n.mensagem}</p></div></div></DropdownMenuItem>; })}
      {notificacoes.length === 0 && <div className="p-4 text-center text-sm text-muted-foreground">Nenhuma notificação</div>}
    </DropdownMenuContent></DropdownMenu>
  );
}
export default NotificacaoDropdown;
