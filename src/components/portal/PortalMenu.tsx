/**
 * @fileoverview Menu do portal do colaborador
 * @module components/portal/PortalMenu
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Home, FileText, Clock, Palmtree, DollarSign, User, HelpCircle } from 'lucide-react';

interface MenuItem { id: string; label: string; icon: React.ReactNode; href: string; badge?: number; }
interface PortalMenuProps { activeItem: string; onNavigate: (id: string) => void; }

const menuItems: MenuItem[] = [
  { id: 'home', label: 'Início', icon: <Home className="h-5 w-5" />, href: '/portal' },
  { id: 'documentos', label: 'Documentos', icon: <FileText className="h-5 w-5" />, href: '/portal/documentos' },
  { id: 'ponto', label: 'Meu Ponto', icon: <Clock className="h-5 w-5" />, href: '/portal/ponto' },
  { id: 'ferias', label: 'Férias', icon: <Palmtree className="h-5 w-5" />, href: '/portal/ferias' },
  { id: 'holerites', label: 'Holerites', icon: <DollarSign className="h-5 w-5" />, href: '/portal/holerites' },
  { id: 'perfil', label: 'Meu Perfil', icon: <User className="h-5 w-5" />, href: '/portal/perfil' },
  { id: 'ajuda', label: 'Ajuda', icon: <HelpCircle className="h-5 w-5" />, href: '/portal/ajuda' },
];

export const PortalMenu = memo(function PortalMenu({ activeItem, onNavigate }: PortalMenuProps) {
  return (
    <Card>
      <CardContent className="p-2">
        <nav className="space-y-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors', activeItem === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
});
