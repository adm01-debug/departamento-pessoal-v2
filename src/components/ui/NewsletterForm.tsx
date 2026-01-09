import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, CheckCircle } from "lucide-react";

interface NewsletterFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
  variant?: "inline" | "stacked";
}

export function NewsletterForm({ title, description, buttonText = "Inscrever", onSubmit, className, variant = "inline" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit?.(email);
      setIsSuccess(true);
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("text-center p-4", className)}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
        <p className="font-medium">Inscrito com sucesso!</p>
        <p className="text-sm text-muted-foreground">Você receberá nossas novidades em breve.</p>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {title && <h3 className="font-semibold mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
      <form onSubmit={handleSubmit} className={cn(variant === "inline" ? "flex gap-2" : "space-y-2")}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
        </div>
        <Button type="submit" disabled={isLoading} className={variant === "stacked" ? "w-full" : ""}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {buttonText}
        </Button>
      </form>
    </div>
  );
}
export default NewsletterForm;
