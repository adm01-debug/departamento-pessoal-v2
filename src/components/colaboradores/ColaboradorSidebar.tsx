import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, FileText, Calendar, DollarSign, Briefcase } from 'lucide-react';

interface ColaboradorSidebarProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
  className?: string;
}

const menuItems = [
  { id: 'dados', label: 'Dados Pessoais', icon: User },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'ferias', label: 'Férias', icon: Calendar },
  { id: 'salario', label: 'Salário', icon: DollarSign },
  { id: 'cargo', label: 'Cargo', icon: Briefcase },
];

export const ColaboradorSidebar = memo(function ColaboradorSidebar({ 
  onNavigate,
  activeSection = 'dados',
  className 
}: ColaboradorSidebarProps) {
  return (
    <Card className={className}>
      <CardContent className="p-2">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => onNavigate?.(item.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
});

export default ColaboradorSidebar;
