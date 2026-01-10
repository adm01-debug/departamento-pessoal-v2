import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface FeedbackFormProps { onSubmit: (data: { rating: number; feedback: string }) => void; loading?: boolean; className?: string; }

export function FeedbackForm({ onSubmit, loading, className }: FeedbackFormProps) {
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState("");
  return (
    <form className={cn("space-y-4", className)} onSubmit={(e) => { e.preventDefault(); onSubmit({ rating, feedback }); }}>
      <div><Label>Avaliação</Label><div className="flex gap-1 mt-1">{[1,2,3,4,5].map((v) => <button key={v} type="button" onClick={() => setRating(v)}><Star className={cn("h-6 w-6", v <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} /></button>)}</div></div>
      <div><Label>Comentário</Label><Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} /></div>
      <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
    </form>
  );
}
export default FeedbackForm;
