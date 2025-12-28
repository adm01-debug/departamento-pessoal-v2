import React from 'react';
import { cn } from '@/lib/utils';

interface ReactionProps { className?: string; children?: React.ReactNode; }

/**
 * Reações
 */
export const Reaction: React.FC<ReactionProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Reaction;
