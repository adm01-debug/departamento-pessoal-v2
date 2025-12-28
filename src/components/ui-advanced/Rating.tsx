import React from 'react';
import { cn } from '@/lib/utils';

interface RatingProps { className?: string; children?: React.ReactNode; }

/**
 * Sistema de avaliação
 */
export const Rating: React.FC<RatingProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Rating;
