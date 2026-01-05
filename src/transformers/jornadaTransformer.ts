import { Jornada, JornadaFormData } from "@/types/jornada.types";

export const jornadaTransformer = {
  toAPI(data: JornadaFormData): Record<string, any> {
    return {
      codigo: data.codigo,
      descricao: data.descricao,
      hora_inicio: data.horaInicio,
      hora_fim: data.horaFim,
      intervalo_inicio: data.intervaloInicio || null,
      intervalo_fim: data.intervaloFim || null,
      carga_horaria_diaria: data.cargaHorariaDiaria,
      carga_horaria_semanal: data.cargaHorariaSemanal,
      carga_horaria_mensal: data.cargaHorariaMensal,
      tipo: data.tipo,
      dias_semana: data.diasSemana,
      tolerancia_entrada: data.toleranciaEntrada,
      tolerancia_saida: data.toleranciaSaida,
      permite_hora_extra: data.permiteHoraExtra,
      permite_banco_horas: data.permiteBancoHoras,
      ativo: data.ativo,
    };
  },

  fromAPI(data: Record<string, any>): Jornada {
    return {
      id: data.id,
      codigo: data.codigo,
      descricao: data.descricao,
      horaInicio: data.hora_inicio,
      horaFim: data.hora_fim,
      intervaloInicio: data.intervalo_inicio,
      intervaloFim: data.intervalo_fim,
      cargaHorariaDiaria: data.carga_horaria_diaria,
      cargaHorariaSemanal: data.carga_horaria_semanal,
      cargaHorariaMensal: data.carga_horaria_mensal,
      tipo: data.tipo,
      diasSemana: data.dias_semana || [],
      toleranciaEntrada: data.tolerancia_entrada,
      toleranciaSaida: data.tolerancia_saida,
      permiteHoraExtra: data.permite_hora_extra,
      permiteBancoHoras: data.permite_banco_horas,
      ativo: data.ativo,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
    };
  },

  toForm(jornada: Jornada): JornadaFormData {
    return {
      codigo: jornada.codigo,
      descricao: jornada.descricao,
      horaInicio: jornada.horaInicio,
      horaFim: jornada.horaFim,
      intervaloInicio: jornada.intervaloInicio,
      intervaloFim: jornada.intervaloFim,
      cargaHorariaDiaria: jornada.cargaHorariaDiaria,
      cargaHorariaSemanal: jornada.cargaHorariaSemanal,
      cargaHorariaMensal: jornada.cargaHorariaMensal,
      tipo: jornada.tipo,
      diasSemana: jornada.diasSemana,
      toleranciaEntrada: jornada.toleranciaEntrada,
      toleranciaSaida: jornada.toleranciaSaida,
      permiteHoraExtra: jornada.permiteHoraExtra,
      permiteBancoHoras: jornada.permiteBancoHoras,
      ativo: jornada.ativo,
    };
  },

  toExport(jornadas: Jornada[]): Record<string, any>[] {
    return jornadas.map(j => ({
      Código: j.codigo,
      Descrição: j.descricao,
      "Hora Início": j.horaInicio,
      "Hora Fim": j.horaFim,
      "Carga Diária": j.cargaHorariaDiaria,
      Tipo: j.tipo,
      Ativo: j.ativo ? "Sim" : "Não",
    }));
  },
};

export default jornadaTransformer;
