import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Pause, Trash2, Download, Save } from "lucide-react";

interface AudioRecorderProps {
  className?: string;
  maxDuration?: number;
  onSave?: (blob: Blob, url: string) => void;
  onCancel?: () => void;
}

export function AudioRecorder({ className, maxDuration = 300, onSave, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) { stopRecording(); return prev; }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) { mediaRecorderRef.current.resume(); timerRef.current = setInterval(() => setDuration(p => p + 1), 1000); }
      else { mediaRecorderRef.current.pause(); if (timerRef.current) clearInterval(timerRef.current); }
      setIsPaused(!isPaused);
    }
  };

  const handleSave = () => {
    if (audioUrl && chunksRef.current.length > 0) {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      onSave?.(blob, audioUrl);
    }
  };

  const handleDiscard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    chunksRef.current = [];
    onCancel?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-card rounded-lg border", className)}>
      <div className="flex items-center justify-center gap-2">
        <div className={cn("w-3 h-3 rounded-full", isRecording && !isPaused ? "bg-red-500 animate-pulse" : "bg-muted")} />
        <span className="text-2xl font-mono">{formatTime(duration)}</span>
        <span className="text-xs text-muted-foreground">/ {formatTime(maxDuration)}</span>
      </div>
      {!audioUrl ? (
        <div className="flex justify-center gap-2">
          {!isRecording ? (
            <Button onClick={startRecording} variant="default"><Mic className="h-4 w-4 mr-2" />Gravar</Button>
          ) : (
            <>
              <Button onClick={togglePause} variant="outline">{isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>
              <Button onClick={stopRecording} variant="destructive"><Square className="h-4 w-4 mr-2" />Parar</Button>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <audio src={audioUrl} controls className="w-full" />
          <div className="flex justify-center gap-2">
            <Button onClick={handleDiscard} variant="outline"><Trash2 className="h-4 w-4 mr-2" />Descartar</Button>
            <Button onClick={handleSave} variant="default"><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default AudioRecorder;
