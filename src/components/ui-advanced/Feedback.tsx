import React from 'react';
import { cn } from '@/lib/utils';

interface FeedbackProps { className?: string; children?: React.ReactNode; }

/**
 * Widget de feedback
 */
export const Feedback: React.FC<FeedbackProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Feedback;
