import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentBoxProps { placeholder?: string; onSubmit: (comment: string) => void; loading?: boolean; className?: string; }

export function CommentBox({ placeholder = "Escreva um comentário...", onSubmit, loading, className }: CommentBoxProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => { if (comment.trim()) { onSubmit(comment); setComment(""); } };

  return (
    <div className={cn("space-y-2", className)}>
      <Textarea placeholder={placeholder} value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!comment.trim() || loading}><Send className="h-4 w-4 mr-2" />{loading ? "Enviando..." : "Enviar"}</Button>
      </div>
    </div>
  );
}
export default CommentBox;
