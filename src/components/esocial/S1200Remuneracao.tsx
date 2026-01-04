import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface S1200RemuneracaoProps { className?: string; data?: any[]; onSubmit?: (data: any) => void; loading?: boolean; }

export function S1200Remuneracao({ className, data = [], onSubmit, loading = false }: S1200RemuneracaoProps) {
  const handleSubmit = () => { if (onSubmit) onSubmit({ component: "S1200Remuneracao", timestamp: new Date().toISOString() }); };
  
  if (loading) return <Card className={cn("animate-pulse", className)}><CardContent className="p-6"><div className="h-20 bg-muted rounded" /></CardContent></Card>;
  
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div><CardTitle className="text-lg">S1200Remuneracao</CardTitle><CardDescription>Componente eSocial</CardDescription></div>
          <Badge variant="outline">eSocial</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">{data.length > 0 ? data.length + " registros" : "Nenhum registro"}</div>
        <Button onClick={handleSubmit} disabled={loading}>Processar</Button>
      </CardContent>
    </Card>
  );
}

export default S1200Remuneracao;
