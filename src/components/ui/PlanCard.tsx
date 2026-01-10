import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PlanCardProps { title: string; price: string; period?: string; features: string[]; popular?: boolean; onSelect?: () => void; className?: string; }

export function PlanCard({ title, price, period = "/mês", features, popular, onSelect, className }: PlanCardProps) {
  return (
    <Card className={cn(popular && "border-primary shadow-lg", className)}>
      <CardHeader className="text-center">
        {popular && <Badge className="w-fit mx-auto mb-2">Popular</Badge>}
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="mt-2"><span className="text-3xl font-bold">{price}</span><span className="text-muted-foreground">{period}</span></div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">{features.map((f, i) => <li key={i} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /><span className="text-sm">{f}</span></li>)}</ul>
        <Button className="w-full" variant={popular ? "default" : "outline"} onClick={onSelect}>Selecionar</Button>
      </CardContent>
    </Card>
  );
}
export default PlanCard;
