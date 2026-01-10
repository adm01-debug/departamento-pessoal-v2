import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface SoundPlayerProps { src: string; title?: string; className?: string; }

export function SoundPlayer({ src, title, className }: SoundPlayerProps) {
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const toggle = () => { if (playing) audioRef.current?.pause(); else audioRef.current?.play(); setPlaying(!playing); };
  return (
    <div className={cn("flex items-center gap-3 p-3 border rounded-lg", className)}>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} muted={muted} />
      <Button size="icon" variant="ghost" onClick={toggle}>{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
      {title && <span className="flex-1 truncate text-sm">{title}</span>}
      <Button size="icon" variant="ghost" onClick={() => setMuted(!muted)}>{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</Button>
    </div>
  );
}
export default SoundPlayer;
