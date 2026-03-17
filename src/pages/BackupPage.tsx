import { useState } from 'react';
import { PageLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Download, Clock, Shield, HardDrive, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BackupPage() {
  const [backing, setBacking] = useState(false);

  const handleBackup = async () => {
    setBacking(true);
    // Simulated backup
    await new Promise(r => setTimeout(r, 2000));
    setBacking(false);
    toast.success('Backup realizado com sucesso!');
  };

  const backups = [
    { id: '1', data: '2026-03-15 10:30', tamanho: '24.5 MB', status: 'completo', tipo: 'Automático' },
    { id: '2', data: '2026-03-14 10:30', tamanho: '24.3 MB', status: 'completo', tipo: 'Automático' },
    { id: '3', data: '2026-03-13 15:00', tamanho: '24.1 MB', status: 'completo', tipo: 'Manual' },
  ];

  return (
    <PageLayout title="Backup" description="Gerencie backups dos dados do sistema" icon={<Database className="h-5 w-5 text-primary-foreground" />} gradient="from-primary-glow to-primary"
      actions={
        <Button onClick={handleBackup} disabled={backing} className="rounded-xl bg-gradient-to-r from-primary-glow to-primary hover:opacity-90 shadow-lg font-body">
          {backing ? <Clock className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {backing ? 'Processando...' : 'Backup Manual'}
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { label: 'Último Backup', value: 'Hoje, 10:30', icon: Clock, gradient: 'from-primary to-primary-glow' },
          { label: 'Total Armazenado', value: '72.9 MB', icon: HardDrive, gradient: 'from-primary to-primary-glow' },
          { label: 'Status', value: 'Saudável', icon: Shield, gradient: 'from-primary to-primary-glow' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border border-border/30 rounded-2xl overflow-hidden relative">
              <div className={cn('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r', stat.gradient)} />
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('p-2.5 rounded-xl bg-gradient-to-br', stat.gradient)}><stat.icon className="h-5 w-5 text-primary-foreground" /></div>
                <div><p className="text-muted-foreground font-body text-xs">{stat.label}</p><p className="font-display font-bold text-lg">{stat.value}</p></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border border-border/30 rounded-2xl shadow-elevated">
        <CardHeader><CardTitle className="font-display">Histórico de Backups</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div>
                    <p className="font-body font-medium text-sm">{b.data}</p>
                    <p className="text-muted-foreground font-body text-xs">{b.tipo} · {b.tamanho}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-lg font-body text-xs"><Download className="h-3.5 w-3.5 mr-1" />Baixar</Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
