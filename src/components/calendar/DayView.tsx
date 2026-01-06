import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'ferias' | 'feriado' | 'reuniao' | 'outro';
  color?: string;
}

interface Props {
  date: Date;
  events: Event[];
  onEventClick?: (event: Event) => void;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

const typeColors = {
  ferias: 'bg-blue-100 border-blue-300 text-blue-800',
  feriado: 'bg-red-100 border-red-300 text-red-800',
  reuniao: 'bg-green-100 border-green-300 text-green-800',
  outro: 'bg-gray-100 border-gray-300 text-gray-800',
};

export function DayView({ date, events, onEventClick }: Props) {
  const dayEvents = events.filter((e) => isSameDay(new Date(e.start), date));

  return (
    <div className="flex flex-col h-full">
      <div className="text-center py-4 border-b">
        <h2 className="text-xl font-bold">{format(date, 'EEEE', { locale: ptBR })}</h2>
        <p className="text-muted-foreground">{format(date, 'dd MMMM yyyy', { locale: ptBR })}</p>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b min-h-[60px]">
              <div className="w-16 text-right pr-2 text-sm text-muted-foreground py-1">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative">
                {dayEvents
                  .filter((e) => new Date(e.start).getHours() === hour)
                  .map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        'absolute left-1 right-1 p-1 rounded border cursor-pointer text-xs',
                        typeColors[event.type]
                      )}
                      onClick={() => onEventClick?.(event)}
                      style={{ top: '2px' }}
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
