import React from 'react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps { className?: string; children?: React.ReactNode; }

/**
 * Paleta de comandos
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default CommandPalette;
