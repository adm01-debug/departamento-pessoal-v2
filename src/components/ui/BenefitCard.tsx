import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Heart, Bus, Utensils, Stethoscope, GraduationCap, Dumbbell } from "lucide-react";

type BenefitType = "saude" | "transporte" | "alimentacao" | "educacao" | "fitness" | "outro";
interface BenefitCardProps { name: string; type: BenefitType; value?: number; employeeContribution?: number; active?: boolean; onToggle?: (active: boolean) => void; className?: string; }

const icons: Record<BenefitType, any> = { saude: Stethoscope, transporte: Bus, alimentacao: Utensils, educacao: GraduationCap, fitness: Dumbbell, outro: Heart };

export function BenefitCard({ name, type, value, employeeContribution, active = true, onToggle, className }: BenefitCardProps) {
  const Icon = icons[type];
  const formatCurrency = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <Card className={cn(!active && "opacity-60", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
            <div><h3 className="font-medium">{name}</h3><Badge variant="secondary" className="mt-1">{type}</Badge></div>
          </div>
          {onToggle && <Switch checked={active} onCheckedChange={onToggle} />}
        </div>
        {(value || employeeContribution) && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
            {value && <div><p className="text-muted-foreground">Valor</p><p className="font-medium">{formatCurrency(value)}</p></div>}
            {employeeContribution && <div><p className="text-muted-foreground">Desconto</p><p className="font-medium text-red-600">{formatCurrency(employeeContribution)}</p></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export default BenefitCard;
