import React from 'react';
import { cn } from '@/lib/utils';

interface FavoriteProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de favoritar
 */
export const Favorite: React.FC<FavoriteProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Favorite;
