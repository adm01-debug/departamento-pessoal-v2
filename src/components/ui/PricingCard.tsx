import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  description?: string;
  price: string;
  period?: string;
  features: string[];
  buttonText?: string;
  popular?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PricingCard({ name, description, price, period = "/mês", features, buttonText = "Selecionar", popular = false, disabled = false, onSelect, className }: PricingCardProps) {
  return (
    <Card className={cn("relative flex flex-col", popular && "border-primary shadow-lg", className)}>
      {popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Mais popular</Badge>}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-6">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={popular ? "default" : "outline"} onClick={onSelect} disabled={disabled}>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}
export default PricingCard;
