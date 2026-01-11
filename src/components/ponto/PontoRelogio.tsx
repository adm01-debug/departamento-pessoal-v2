// V15-258: src/components/ponto/PontoRelogio.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PontoRelogio() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="text-5xl font-bold font-mono">{format(now, 'HH:mm:ss')}</div>
        <div className="text-muted-foreground mt-2 capitalize">{format(now, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</div>
      </CardContent>
    </Card>
  );
}
