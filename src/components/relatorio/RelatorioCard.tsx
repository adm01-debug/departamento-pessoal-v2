// V15-272: src/components/relatorio/RelatorioCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon, Download, Eye } from 'lucide-react';

interface RelatorioCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onView?: () => void;
  onDownload?: () => void;
}

export function RelatorioCard({ title, description, icon: Icon, onView, onDownload }: RelatorioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-2 bg-primary/10 rounded"><Icon className="h-6 w-6 text-primary" /></div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2">
        {onView && <Button variant="outline" size="sm" onClick={onView}><Eye className="h-4 w-4 mr-1" />Visualizar</Button>}
        {onDownload && <Button variant="outline" size="sm" onClick={onDownload}><Download className="h-4 w-4 mr-1" />Baixar</Button>}
      </CardContent>
    </Card>
  );
}
