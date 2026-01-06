import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, Star, Bug, Zap, Shield, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { PageLayout } from '@/components/layout/PageLayout';
import { formatDate } from '@/utils/formatters';

interface Release { version: string; date: string; type: 'major' | 'minor' | 'patch'; changes: { type: 'feature' | 'fix' | 'improvement' | 'security'; description: string; }[]; }

const releases: Release[] = [
  { version: '2.5.0', date: '2026-01-06', type: 'minor', changes: [{ type: 'feature', description: 'Nova página de auditoria' }, { type: 'feature', description: 'Sistema de backup automático' }, { type: 'improvement', description: 'Performance do dashboard' }] },
  { version: '2.4.2', date: '2026-01-02', type: 'patch', changes: [{ type: 'fix', description: 'Correção no cálculo de férias' }, { type: 'fix', description: 'Erro ao exportar PDF' }] },
  { version: '2.4.0', date: '2025-12-20', type: 'minor', changes: [{ type: 'feature', description: 'Integração com eSocial S-1.2' }, { type: 'security', description: 'Atualização de dependências' }] },
];

const typeConfig = { feature: { icon: Star, color: 'text-green-600', label: 'Novo' }, fix: { icon: Bug, color: 'text-red-600', label: 'Correção' }, improvement: { icon: Zap, color: 'text-blue-600', label: 'Melhoria' }, security: { icon: Shield, color: 'text-purple-600', label: 'Segurança' } };
const versionColor = { major: 'bg-red-100 text-red-800', minor: 'bg-blue-100 text-blue-800', patch: 'bg-gray-100 text-gray-800' };

export default function ChangelogPage() {
  return (
    <PageLayout>
      <PageHeader title="Changelog" description="Histórico de atualizações e melhorias do sistema" breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Changelog' }]} />
      <div className="space-y-6">
        {releases.map(release => (
          <Card key={release.version}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6" />
                  <CardTitle>v{release.version}</CardTitle>
                  <Badge className={versionColor[release.type]}>{release.type}</Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />{formatDate(release.date)}</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {release.changes.map((change, i) => {
                  const cfg = typeConfig[change.type];
                  const Icon = cfg.icon;
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${cfg.color}`} />
                      <div><Badge variant="outline" className="mr-2">{cfg.label}</Badge><span>{change.description}</span></div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
