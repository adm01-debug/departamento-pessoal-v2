import { SEOHead } from '@/components/SEOHead';
import { CalendarioFeriados } from '@/components/feriados/CalendarioFeriados';

export default function Feriados() {
  useEffect(() => {
    document.title = 'Feriados | DP System';
  }, []);

  return (
      <>
        <SEOHead title="Feriados" description="Calendário de feriados" />
        <>
      
      <div id="main-content" className="p-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Calendário de Feriados
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie feriados nacionais, estaduais e municipais
          </p>
        </div>

        <CalendarioFeriados />
      </div>
    </>
  );
}





