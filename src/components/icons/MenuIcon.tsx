/**
 * @fileoverview Ícone de menu
 * @module components/icons/MenuIcon
 */
import { memo } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuIconProps { isOpen: boolean; className?: string; }

export const MenuIcon = memo(function MenuIcon({ isOpen, className }: MenuIconProps) {
  const Icon = isOpen ? X : Menu;
  return <Icon className={cn('h-5 w-5 transition-transform', className)} />;
});
