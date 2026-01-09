import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Phone, Mail, Globe } from "lucide-react";

interface CompanyInfoCardProps { name: string; cnpj: string; address?: string; phone?: string; email?: string; website?: string; className?: string; }

export function CompanyInfoCard({ name, cnpj, address, phone, email, website, className }: CompanyInfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center"><Building2 className="h-6 w-6 text-primary" /></div>
        <div><CardTitle className="text-base">{name}</CardTitle><p className="text-sm text-muted-foreground">CNPJ: {cnpj}</p></div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {address && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><span>{address}</span></div>}
        {phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{phone}</span></div>}
        {email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{email}</span></div>}
        {website && <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /><a href={website} className="text-primary hover:underline">{website}</a></div>}
      </CardContent>
    </Card>
  );
}
export default CompanyInfoCard;
