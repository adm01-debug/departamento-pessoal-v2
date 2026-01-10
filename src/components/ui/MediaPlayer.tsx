import React from "react";
import { cn } from "@/lib/utils";

interface MediaPlayerProps { src: string; poster?: string; className?: string; }

export function MediaPlayer({ src, poster, className }: MediaPlayerProps) {
  return <video src={src} poster={poster} controls className={cn("w-full rounded-lg", className)} />;
}
export default MediaPlayer;
