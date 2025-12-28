import React from 'react';
import { cn } from '@/lib/utils';

interface ContextMenuProps { className?: string; children?: React.ReactNode; }

/**
 * Menu de contexto
 */
export const ContextMenu: React.FC<ContextMenuProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default ContextMenu;
