/**
 * @fileoverview Lista de benefícios com gestão e filtros
 * @module components/beneficios/BeneficioList
 */
import { memo, useState, useMemo } from 'react';
import { Search, Plus, Gift } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BeneficioCard } from './BeneficioCard';

type TipoBeneficio = 'saude' | 'vale_transporte' | 'vale_refeicao' | 'vale_alimentacao' | 'educacao' | 'seguro_vida' | 'outros';

interface Beneficio {
  id: string;
  nome: string;
  tipo: TipoBeneficio;
  valor?: number;
  desconto?: number;
  descricao?: string;
  ativo: boolean;
  colaboradoresAtivos?: number;
}

interface BeneficioListProps {
  beneficios: Beneficio[];
  onNovoBeneficio?: () => void;
  onToggle?: (id: string, ativo: boolean) => void;
  onConfigurar?: (id: string) => void;
  isLoading?: boolean;
}

/**
 * Lista de benefícios com filtros por status
 * @param props - Propriedades
 * @returns Elemento React
 */
export const BeneficioList = memo(function BeneficioList({
  beneficios,
  onNovoBeneficio,
  onToggle,
  onConfigurar,
  isLoading = false,
}: BeneficioListProps) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('todos');

  const filteredBeneficios = useMemo(() => {
    return beneficios.filter(b => {
      const matchSearch = b.nome.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === 'todos' || (tab === 'ativos' ? b.ativo : !b.ativo);
      return matchSearch && matchTab;
    });
  }, [beneficios, search, tab]);

  const stats = useMemo(() => ({
    total: beneficios.length,
    ativos: beneficios.filter(b => b.ativo).length,
    inativos: beneficios.filter(b => !b.ativo).length,
    valorTotal: beneficios.filter(b => b.ativo).reduce((acc, b) => acc + (b.valor || 0), 0),
  }), [beneficios]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar benefício..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {onNovoBeneficio && (
          <Button onClick={onNovoBeneficio} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Benefício
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({stats.total})</TabsTrigger>
          <TabsTrigger value="ativos">Ativos ({stats.ativos})</TabsTrigger>
          <TabsTrigger value="inativos">Inativos ({stats.inativos})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filteredBeneficios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Gift className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium">Nenhum benefício encontrado</h3>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBeneficios.map(beneficio => (
                <BeneficioCard
                  key={beneficio.id}
                  beneficio={beneficio as any}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
});
