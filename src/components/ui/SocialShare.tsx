import React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Link, Mail, MessageCircle } from "lucide-react";

interface SocialShareProps { url: string; title?: string; onCopyLink?: () => void; }

export function SocialShare({ url, title, onCopyLink }: SocialShareProps) {
  const handleCopy = async () => { await navigator.clipboard.writeText(url); onCopyLink?.(); };
  const handleEmail = () => window.open(`mailto:?subject=${encodeURIComponent(title || "")}&body=${encodeURIComponent(url)}`);
  const handleWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${title || ""} ${url}`)}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" size="sm"><Share2 className="h-4 w-4 mr-2" />Compartilhar</Button></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleCopy}><Link className="h-4 w-4 mr-2" />Copiar link</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}><Mail className="h-4 w-4 mr-2" />Email</DropdownMenuItem>
        <DropdownMenuItem onClick={handleWhatsApp}><MessageCircle className="h-4 w-4 mr-2" />WhatsApp</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default SocialShare;
