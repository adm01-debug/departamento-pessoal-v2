import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/ui/page-header";
import { Save, DollarSign, Calendar, Percent } from "lucide-react";
export function ParametrosConfigPage() {
  return (<div className="space-y-6"><PageHeader title="Parâmetros do Sistema" description="Configurações de cálculo e operacionais"><Button><Save className="h-4 w-4 mr-2" />Salvar</Button></PageHeader><div className="grid gap-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Valores de Referência</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-4"><div><Label>Salário Mínimo</Label><Input type="number" defaultValue="1518.00" /></div><div><Label>Teto INSS</Label><Input type="number" defaultValue="8157.41" /></div><div><Label>Dedução Dependente IRRF</Label><Input type="number" defaultValue="189.59" /></div></div></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Prazos</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-3 gap-4"><div><Label>Dia Fechamento Ponto</Label><Input type="number" defaultValue="25" /></div><div><Label>Dia Pagamento</Label><Input type="number" defaultValue="5" /></div><div><Label>Prazo FGTS (dia)</Label><Input type="number" defaultValue="7" /></div></div></CardContent></Card><Card><CardHeader><CardTitle>Opções</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center justify-between"><div><Label>Calcular DSR automático</Label><p className="text-sm text-muted-foreground">Incluir DSR nas horas extras</p></div><Switch defaultChecked /></div><div className="flex items-center justify-between"><div><Label>Arredondar horas extras</Label><p className="text-sm text-muted-foreground">Arredondar para 5 minutos</p></div><Switch /></div></CardContent></Card></div></div>);
}
export default ParametrosConfigPage;
