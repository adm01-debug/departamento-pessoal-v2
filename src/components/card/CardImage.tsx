import { memo } from "react";
interface CardImageProps { src: string; alt: string; className?: string; }
export const CardImage = memo(function CardImage({ src, alt, className }: CardImageProps) {
  return <img src={src} alt={alt} className={className || "w-full h-48 object-cover rounded-t-lg"} />;
});
