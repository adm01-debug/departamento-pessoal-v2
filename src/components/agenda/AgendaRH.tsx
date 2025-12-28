import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
interface AgendaRHProps { events?: any[]; onDateSelect?: (date: Date) => void; }
export const AgendaRH: React.FC<AgendaRHProps> = ({ events = [], onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />AgendaRH</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d => <div key={d} className="font-medium p-2">{d}</div>)}
          {Array.from({length: 35}, (_, i) => <div key={i} className="p-2 border rounded hover:bg-accent cursor-pointer" onClick={() => onDateSelect?.(new Date())}>{(i % 31) + 1}</div>)}
        </div>
      </CardContent>
    </Card>
  );
};
export default AgendaRH;
