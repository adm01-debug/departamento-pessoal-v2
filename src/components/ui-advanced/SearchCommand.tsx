import React from 'react';
import { cn } from '@/lib/utils';

interface SearchCommandProps { className?: string; children?: React.ReactNode; }

/**
 * Busca de comandos
 */
export const SearchCommand: React.FC<SearchCommandProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default SearchCommand;
