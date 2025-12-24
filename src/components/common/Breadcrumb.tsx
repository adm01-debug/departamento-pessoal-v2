/**
 * @fileoverview Breadcrumb de navegação
 * @module components/common/Breadcrumb
 */
import { memo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem { label: string; href?: string; }
interface BreadcrumbProps { items: BreadcrumbItem[]; onNavigate?: (href: string) => void; }

export const Breadcrumb = memo(function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      <button onClick={() => onNavigate?.('/')} className="hover:text-foreground"><Home className="h-4 w-4" /></button>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2" />
          {item.href ? (
            <button onClick={() => onNavigate?.(item.href!)} className="hover:text-foreground">{item.label}</button>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
});
