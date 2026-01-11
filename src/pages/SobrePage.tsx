// V15-481
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONFIG } from '@/config/app';
import { Building2, Code, Shield, Zap } from 'lucide-react';
const features = [{ icon: Zap, title: 'Rápido', desc: 'Processamento instantâneo' }, { icon: Shield, title: 'Seguro', desc: 'Dados protegidos' }, { icon: Code, title: 'Moderno', desc: 'Tecnologia de ponta' }];
export default function SobrePage() {
  return (
    <PageLayout title="Sobre o Sistema">
      <Card className="mb-6"><CardHeader className="flex flex-row items-center gap-4"><Building2 className="h-12 w-12 text-primary" /><div><CardTitle>{APP_CONFIG.name}</CardTitle><p className="text-muted-foreground">Versão {APP_CONFIG.version}</p></div></CardHeader><CardContent><p className="text-muted-foreground">{APP_CONFIG.description}</p></CardContent></Card>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(f => (<Card key={f.title}><CardContent className="pt-6 flex items-center gap-4"><f.icon className="h-8 w-8 text-primary" /><div><p className="font-medium">{f.title}</p><p className="text-sm text-muted-foreground">{f.desc}</p></div></CardContent></Card>))}
      </div>
    </PageLayout>
  );
}
