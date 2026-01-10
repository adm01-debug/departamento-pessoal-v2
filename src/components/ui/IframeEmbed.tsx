import React from "react";
import { cn } from "@/lib/utils";

interface IframeEmbedProps { src: string; title: string; aspectRatio?: "video" | "square" | "portrait"; className?: string; }

export function IframeEmbed({ src, title, aspectRatio = "video", className }: IframeEmbedProps) {
  const ratios = { video: "aspect-video", square: "aspect-square", portrait: "aspect-[3/4]" };
  return <iframe src={src} title={title} className={cn("w-full rounded-lg border-0", ratios[aspectRatio], className)} allowFullScreen />;
}
export default IframeEmbed;
