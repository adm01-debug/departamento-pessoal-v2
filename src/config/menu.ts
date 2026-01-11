// V15-354
import { Home, Users, Building2, FileText, Calendar, Clock, Gift, BarChart3, Settings, FileCheck, Briefcase, DollarSign, Shield } from 'lucide-react';
export const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/colaboradores', label: 'Colaboradores', icon: Users },
  { path: '/empresas', label: 'Empresas', icon: Building2 },
  { path: '/folha', label: 'Folha', icon: DollarSign },
  { path: '/ferias', label: 'Férias', icon: Calendar },
  { path: '/ponto', label: 'Ponto', icon: Clock },
  { path: '/beneficios', label: 'Benefícios', icon: Gift },
  { path: '/departamentos', label: 'Departamentos', icon: Briefcase },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/esocial', label: 'eSocial', icon: FileCheck },
  { path: '/auditoria', label: 'Auditoria', icon: Shield },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
] as const;
