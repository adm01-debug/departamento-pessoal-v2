import React from 'react';
import { cn } from '@/lib/utils';

interface AnnouncementProps { className?: string; children?: React.ReactNode; }

/**
 * Banner de anúncio
 */
export const Announcement: React.FC<AnnouncementProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Announcement;
