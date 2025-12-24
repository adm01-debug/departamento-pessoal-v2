/**
 * @fileoverview Imagem do card
 * @module components/card/CardImage
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
  position?: 'top' | 'bottom';
}

const aspectStyles: Record<string, string> = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[2/1]',
};

export const CardImage = memo(function CardImage({
  src, alt, className, aspectRatio = 'video', position = 'top',
}: CardImageProps) {
  return (
    <div className={cn(
      'overflow-hidden',
      position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg',
      aspectStyles[aspectRatio],
      className
    )}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    </div>
  );
});
