/**
 * @fileoverview Componente de avatar
 * @module components/common/Avatar
 */
import { memo } from 'react';
import { Avatar as ShadAvatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AvatarProps { src?: string; nome: string; size?: 'sm' | 'md' | 'lg'; className?: string; }

const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };

export const Avatar = memo(function Avatar({ src, nome, size = 'md', className }: AvatarProps) {
  const initials = nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <ShadAvatar className={cn(sizeMap[size], className)}>
      <AvatarImage src={src} alt={nome} />
      <AvatarFallback>{initials}</AvatarFallback>
    </ShadAvatar>
  );
});
