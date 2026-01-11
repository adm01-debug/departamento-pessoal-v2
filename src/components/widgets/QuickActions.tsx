// V15-426
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Calculator, Calendar, Clock, FileText, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const actions = [{ icon: UserPlus, label: 'Admissão', path: '/admissao' }, { icon: Calculator, label: 'Calcular Folha', path: '/folha/calcular' }, { icon: Calendar, label: 'Férias', path: '/ferias' }, { icon: Clock, label: 'Ponto', path: '/ponto' }, { icon: FileText, label: 'Relatórios', path: '/relatorios' }, { icon: DollarSign, label: 'Benefícios', path: '/beneficios' }];
export function QuickActions() {
  const navigate = useNavigate();
  return (<Card><CardHeader><CardTitle className="text-base">Ações Rápidas</CardTitle></CardHeader><CardContent><div className="grid grid-cols-3 gap-2">{actions.map(a => (<Button key={a.path} variant="outline" className="flex-col h-auto py-3" onClick={() => navigate(a.path)}><a.icon className="h-5 w-5 mb-1" /><span className="text-xs">{a.label}</span></Button>))}</div></CardContent></Card>);
}
