/**
 * @fileoverview Hook para gerenciamento de calendário
 * @module hooks/useCalendario
 */
import { useState, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface EventoCalendario {
  id: string;
  titulo: string;
  data: Date;
  tipo: 'ferias' | 'admissao' | 'desligamento' | 'aniversario' | 'feriado' | 'outro';
  cor?: string;
}

export function useCalendario(eventos: EventoCalendario[] = []) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dias = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const eventosDoMes = useMemo(() => {
    return eventos.filter(e => isSameMonth(e.data, currentDate));
  }, [eventos, currentDate]);

  const eventosNoDia = (dia: Date) => eventos.filter(e => isSameDay(e.data, dia));

  const proximoMes = () => setCurrentDate(addMonths(currentDate, 1));
  const mesAnterior = () => setCurrentDate(subMonths(currentDate, 1));
  const irParaHoje = () => setCurrentDate(new Date());

  return {
    currentDate,
    selectedDate,
    dias,
    eventosDoMes,
    eventosNoDia,
    setSelectedDate,
    proximoMes,
    mesAnterior,
    irParaHoje,
    mesAno: format(currentDate, 'MMMM yyyy', { locale: ptBR }),
    isToday,
    isSameDay,
  };
}

export default useCalendario;
