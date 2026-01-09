import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Twitter, Facebook, Linkedin, Link, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
}

export function ShareButton({ url, title = "", description = "", className }: ShareButtonProps) {
  const { toast } = useToast?.() || { toast: () => {} };

  const shareOptions = [
    { name: "Twitter", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { name: "Email", icon: Mail, url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}` },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "O link foi copiado para a área de transferência." });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={className}><Share2 className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {shareOptions.map((opt) => (
          <DropdownMenuItem key={opt.name} asChild>
            <a href={opt.url} target="_blank" rel="noopener noreferrer"><opt.icon className="h-4 w-4 mr-2" />{opt.name}</a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={copyToClipboard}><Link className="h-4 w-4 mr-2" />Copiar link</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ShareButton;
