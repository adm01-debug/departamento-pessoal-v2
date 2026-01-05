import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Save, Bell, Mail, MessageSquare } from "lucide-react";
export function NotificacoesConfigPage() {
  return (<div className="space-y-6"><PageHeader title="Notificações" description="Configurar alertas e notificações"><Button><Save className="h-4 w-4 mr-2" />Salvar</Button></PageHeader><div className="grid gap-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Alertas do Sistema</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><Label>Férias vencendo</Label><p className="text-sm text-muted-foreground">Alertar 30 dias antes</p></div><Switch defaultChecked /></div><div className="flex items-center justify-between"><div><Label>ASO vencendo</Label><p className="text-sm text-muted-foreground">Alertar 15 dias antes</p></div><Switch defaultChecked /></div><div className="flex items-center justify-between"><div><Label>Documentos expirando</Label><p className="text-sm text-muted-foreground">Alertar 30 dias antes</p></div><Switch defaultChecked /></div></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Email</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><Label>Enviar resumo diário</Label><p className="text-sm text-muted-foreground">Email às 8h</p></div><Switch /></div><div className="flex items-center justify-between"><div><Label>Enviar alertas críticos</Label><p className="text-sm text-muted-foreground">Erros eSocial, inconsistências</p></div><Switch defaultChecked /></div></CardContent></Card></div></div>);
}
export default NotificacoesConfigPage;
