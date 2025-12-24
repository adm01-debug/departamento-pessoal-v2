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
  /** Aspecto da imagem */
  aspect?: 'video' | 'square' | 'wide';
  /** Posição da imagem no card */
  position?: 'top' | 'bottom';
}

/** Mapeamento de aspectos */
const aspectStyles: Record<string, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[21/9]',
};

/**
 * Imagem para exibição em cards
 * @param props - Propriedades do componente
 * @returns Elemento JSX da imagem
 */
export const CardImage = memo(function CardImage({
  src,
  alt,
  className,
  aspect = 'video',
  position = 'top',
}: CardImageProps) {
  return (
    <div
      className={cn(
        'overflow-hidden',
        aspectStyles[aspect],
        position === 'top' ? 'rounded-t-lg' : 'rounded-b-lg',
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
});
