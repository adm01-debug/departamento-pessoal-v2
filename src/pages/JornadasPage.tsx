import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { JornadaCard } from "@/components/jornada/JornadaCard";
import { Plus } from "lucide-react";
const mockJornadas = [{ id: "1", codigo: "J001", descricao: "Comercial", horaInicio: "08:00", horaFim: "18:00", cargaHoraria: 44, tipo: "NORMAL", diasSemana: ["SEG", "TER", "QUA", "QUI", "SEX"], ativo: true }, { id: "2", codigo: "J002", descricao: "Turno Manhã", horaInicio: "06:00", horaFim: "14:00", cargaHoraria: 40, tipo: "TURNO", diasSemana: ["SEG", "TER", "QUA", "QUI", "SEX"], ativo: true }];
export function JornadasPage() {
  return (<div className="space-y-6"><PageHeader title="Jornadas de Trabalho" description="Configuração de jornadas"><Button><Plus className="h-4 w-4 mr-2" />Nova Jornada</Button></PageHeader><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{mockJornadas.map(j => <JornadaCard key={j.id} jornada={j} />)}</div></div>);
}
export default JornadasPage;
