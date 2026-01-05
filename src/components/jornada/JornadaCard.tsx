import React from "react";
import { Jornada } from "@/types/jornada.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2, Calendar, Timer } from "lucide-react";

interface JornadaCardProps {
  jornada: Jornada;
  onEdit?: () => void;
  onDelete?: () => void;
}

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function JornadaCard({ jornada, onEdit, onDelete }: JornadaCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5" />{jornada.descricao}</CardTitle>
            <p className="text-sm text-muted-foreground">{jornada.codigo}</p>
          </div>
          <div className="flex gap-1">
            <Badge variant={jornada.ativo ? "default" : "secondary"}>{jornada.ativo ? "Ativo" : "Inativo"}</Badge>
            <Badge variant="outline">{jornada.tipo}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Timer className="w-4 h-4 text-muted-foreground" /><span>{jornada.horaInicio} - {jornada.horaFim}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><span>{jornada.cargaHorariaDiaria}h/dia</span></div>
        </div>
        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><div className="flex gap-1">{jornada.diasSemana.map(d => <Badge key={d} variant="outline" className="text-xs">{DIAS[d]}</Badge>)}</div></div>
        <div className="flex gap-2 pt-2">
          {onEdit && <Button variant="outline" size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Editar</Button>}
          {onDelete && <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600"><Trash2 className="w-4 h-4 mr-1" />Excluir</Button>}
        </div>
      </CardContent>
    </Card>
  );
}

export default JornadaCard;
