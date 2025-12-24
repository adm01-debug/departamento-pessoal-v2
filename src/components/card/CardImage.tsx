/**
 * @fileoverview Imagem do card
 * @module components/card/CardImage
 */
import { memo } from 'react';
import { cn } from '@/lib/utils';

/** Props do CardImage */
interface CardImageProps {
  /** URL da imagem */
  src: string;
  /** Texto alternativo */
  alt: string;
  /** Classes CSS adicionais */
  className?: string;
  /** Altura da imagem */
  height?: 'sm' | 'md' | 'lg' | 'auto';
  /** Posição da imagem */
  position?: 'top' | 'bottom';
}

/** Mapeamento de alturas */
const heightStyles: Record<string, string> = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64',
  auto: 'h-auto',
};

/**
 * Imagem para cards com aspect ratio consistente
 * @param props - Propriedades do componente
 * @returns Elemento JSX da imagem
 */
export const CardImage = memo(function CardImage({
  src,
  alt,
  className,
  height = 'md',
  position = 'top',
}: CardImageProps) {
  return (
    <div
      className={cn(
        'overflow-hidden',
        position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full object-cover',
          heightStyles[height]
        )}
      />
    </div>
  );
});
