/**
 * @fileoverview Ícone de navegação
 * @module components/icons/NavIcon
 */
import { memo } from 'react';
import { Home, Users, Settings, FileText, Calendar, DollarSign, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavIconProps { type: 'home'|'users'|'settings'|'docs'|'calendar'|'money'|'clock'|'company'; className?: string; }

const icons = { home: Home, users: Users, settings: Settings, docs: FileText, calendar: Calendar, money: DollarSign, clock: Clock, company: Building2 };

export const NavIcon = memo(function NavIcon({ type, className }: NavIconProps) {
  const Icon = icons[type];
  return <Icon className={cn('h-5 w-5', className)} />;
});
