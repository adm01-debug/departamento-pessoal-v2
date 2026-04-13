import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, PenTool, Upload, ChevronRight } from 'lucide-react';

interface PortalDocumentosTabProps {
  navigate: (path: string) => void;
}

export function PortalDocumentosTab({ navigate }: PortalDocumentosTabProps) {
  const items = [
    { label: 'Documentos Pessoais', path: '/documentos', icon: FileText, desc: 'Envie e consulte seus documentos' },
    { label: 'Contratos', path: '/assinaturas', icon: PenTool, desc: 'Assine documentos pendentes' },
    { label: 'Holerites', path: '/holerites', icon: DollarSign, desc: 'Baixe seus contracheques' },
    { label: 'Gerador de Docs', path: '/gerador-documentos', icon: FileText, desc: 'Gere declarações e atestados' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h3 font-display font-bold">Meus Documentos</h2>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/documentos')}>
          <Upload className="h-4 w-4 mr-1" />Enviar Documento
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map(({ label, path, icon: Icon, desc }) => (
          <Card key={path} className="border border-border/30 rounded-xl cursor-pointer hover:shadow-elevated transition-all" onClick={() => navigate(path)}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-warning to-warning/70"><Icon className="h-4 w-4 text-primary-foreground" /></div>
              <div className="flex-1">
                <p className="font-display font-semibold text-sm">{label}</p>
                <p className="text-xs text-muted-foreground font-body">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
