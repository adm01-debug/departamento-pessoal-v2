import React from "react";
import { cn } from "@/lib/utils";

interface MapEmbedProps { lat: number; lng: number; zoom?: number; className?: string; }

export function MapEmbed({ lat, lng, zoom = 15, className }: MapEmbedProps) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01}%2C${lat-0.01}%2C${lng+0.01}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lng}`;
  return <iframe src={src} className={cn("w-full aspect-video rounded-lg border", className)} />;
}
export default MapEmbed;
