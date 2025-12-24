import { memo } from "react";
interface CardImageProps { src: string; alt: string; className?: string; }
export const CardImage = memo(function CardImage({ src, alt, className }: CardImageProps) {
  return <img src={src} alt={alt} className={`w-full object-cover ${className || ""}`} />;
});
