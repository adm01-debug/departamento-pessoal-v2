/**
 * @fileoverview Changelog - Histórico de versões
 * @module pages/Changelog
 */
import { useEffect, memo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Bug, Sparkles, Shield, Zap } from 'lucide-react';

const RELEASES = [
  {
    versao: '8.4.0',
    data: '30 Dez 2025',
    tipo: 'major',
    items: [
      { tipo: 'feature', texto: 'Novo módulo de Integrações (Bitrix24, eSocial, Webhooks)' },
      { tipo: 'feature', texto: 'Sistema de chamados de suporte integrado' },
      { tipo: 'feature', texto: 'Central de ajuda com FAQ interativo' },
      { tipo: 'improvement', texto: '33 correções de QA aplicadas' },
      { tipo: 'improvement', texto: 'Páginas institucionais completas' },
    ]
  },
  {
    versao: '8.3.0',
    data: '29 Dez 2025',
    tipo: 'major',
    items: [
      { tipo: 'feature', texto: 'Gestão de Empresas multi-tenant' },
      { tipo: 'feature', texto: 'CRUD completo de Departamentos' },
      { tipo: 'feature', texto: 'CRUD completo de Cargos com faixa salarial' },
      { tipo: 'fix', texto: 'Correção de imports duplicados' },
      { tipo: 'fix', texto: 'Correção de regex em validações' },
    ]
  },
  {
    versao: '8.2.0',
    data: '28 Dez 2025',
    tipo: 'minor',
    items: [
      { tipo: 'feature', texto: 'Tabelas INSS/IRRF 2025 atualizadas' },
      { tipo: 'feature', texto: 'Cálculo de rescisão completo' },
      { tipo: 'improvement', texto: 'Logger centralizado em services' },
      { tipo: 'fix', texto: 'Correção de tipagem TypeScript' },
    ]
  },
  {
    versao: '8.1.0',
    data: '27 Dez 2025',
    tipo: 'minor',
    items: [
      { tipo: 'feature', texto: 'Backup e restauração automáticos' },
      { tipo: 'feature', texto: 'Configurações avançadas do sistema' },
      { tipo: 'security', texto: 'Melhorias de segurança na autenticação' },
    ]
  },
  {
    versao: '8.0.0',
    data: '20 Dez 2025',
    tipo: 'major',
    items: [
      { tipo: 'feature', texto: 'Redesign completo da interface' },
      { tipo: 'feature', texto: 'Novo dashboard com KPIs' },
      { tipo: 'feature', texto: 'Módulo de férias reformulado' },
      { tipo: 'improvement', texto: 'Performance 50% melhor' },
    ]
  },
];

const ChangelogPage = memo(function ChangelogPage() {
  useEffect(() => { document.title = 'Changelog | DP System'; }, []);

  const getIcon = (tipo: string) => {
    const icons: Record<string, React.ReactNode> = {
      feature: <Sparkles className="h-4 w-4 text-blue-600" />,
      improvement: <Zap className="h-4 w-4 text-green-600" />,
      fix: <Bug className="h-4 w-4 text-orange-600" />,
      security: <Shield className="h-4 w-4 text-red-600" />,
    };
    return icons[tipo] || <Rocket className="h-4 w-4" />;
  };

  const getLabel = (tipo: string) => {
    const labels: Record<string, string> = { feature: 'Novo', improvement: 'Melhoria', fix: 'Correção', security: 'Segurança' };
    return labels[tipo] || tipo;
  };

  return (
    <>
      <SEOHead title="Changelog" description="Histórico de versões" />
      <div className="container mx-auto p-6 max-w-3xl space-y-6">
        <div className="text-center space-y-4">
          <Rocket className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-3xl font-bold">Changelog</h1>
          <p className="text-muted-foreground">Histórico de atualizações e novidades</p>
        </div>

        <div className="space-y-6">
          {RELEASES.map((release, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    v{release.versao}
                    <Badge variant={release.tipo === 'major' ? 'default' : 'secondary'}>
                      {release.tipo}
                    </Badge>
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">{release.data}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {release.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2">
                      {getIcon(item.tipo)}
                      <span className="text-sm">
                        <Badge variant="outline" className="mr-2 text-xs">{getLabel(item.tipo)}</Badge>
                        {item.texto}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
});

export default ChangelogPage;
