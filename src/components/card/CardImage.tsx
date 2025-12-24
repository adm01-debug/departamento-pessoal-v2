/**
 * @file CardImage.tsx
 * @description Imagem de destaque do card
 * @category Components/Card
 */

import React, { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

/**
 * Props do CardImage
 */
export interface CardImageProps {
  /** URL da imagem */
  src: string;
  /** Texto alternativo */
  alt: string;
  /** Classe adicional */
  className?: string;
  /** Proporção da imagem */
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
  /** Posição da imagem */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Fit da imagem */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Altura fixa */
  height?: string | number;
  /** Overlay escuro */
  overlay?: boolean;
  /** Conteúdo sobre a imagem */
  overlayContent?: React.ReactNode;
}

const aspectRatioClasses = {
  auto: '',
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
};

const objectFitClasses = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
};

const positionClasses = {
  top: 'rounded-t-lg',
  bottom: 'rounded-b-lg',
  left: 'rounded-l-lg',
  right: 'rounded-r-lg',
};

/**
 * Imagem de destaque do card
 * 
 * @example
 * ```tsx
 * <CardImage 
 *   src="/hero.jpg" 
 *   alt="Hero image"
 *   aspectRatio="video"
 *   overlay
 *   overlayContent={<h2>Título</h2>}
 * />
 * ```
 */
export const CardImage = memo(function CardImage({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  position = 'top',
  objectFit = 'cover',
  height,
  overlay = false,
  overlayContent,
}: CardImageProps) {
  const [error, setError] = useState(false);

  const heightStyle = height
    ? { height: typeof height === 'number' ? `${height}px` : height }
    : undefined;

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted',
          aspectRatioClasses[aspectRatio],
          positionClasses[position],
          className
        )}
        style={heightStyle}
      >
        <ImageOff className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatioClasses[aspectRatio],
        positionClasses[position],
        className
      )}
      style={heightStyle}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className={cn(
          'w-full h-full',
          objectFitClasses[objectFit],
          positionClasses[position]
        )}
      />
      {overlay && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      {overlayContent && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          {overlayContent}
        </div>
      )}
    </div>
  );
});

CardImage.displayName = 'CardImage';

export default CardImage;
