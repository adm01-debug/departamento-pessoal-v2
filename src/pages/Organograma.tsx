import { useState, memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Building2, 
  ChevronDown, 
  ChevronRight, 
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  User,
  Mail,
  Phone,
  Loader2
} from 'lucide-react';
import { useColaboradores } from '@/hooks/useColaboradores';
import { useEmpresas } from '@/hooks/useEmpresas';
import { cn } from '@/lib/utils';

interface DepartmentNode {
  name: string;
  colaboradores: unknown[];
  expanded: boolean;
}

export default memo(function Organograma() {
  useEffect(() => { document.title = 'Organograma | DP System'; }, []);

  const { empresaAtual } = useEmpresas();
  const { colaboradores, loading } = useColaboradores();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchy' | 'grid'>('hierarchy');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [selectedColaborador, setSelectedColaborador] = useState<unknown>(null);
  const [zoom, setZoom] = useState(100);

  // Agrupar colaboradores por departamento
  const departamentos = useMemo(() => {
    const ativos = colaboradores.filter(c => c.status === 'ativo');
    const depts = new Map<string, any[]>();
    
    ativos.forEach(colab => {
      const dept = colab.departamento || 'Sem Departamento';
      if (!depts.has(dept)) {
        depts.set(dept, []);
      }
      depts.get(dept)!.push(colab);
    });

    // Ordenar departamentos
    return Array.from(depts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, colaboradores]) => ({
        name,
        colaboradores: colaboradores.sort((a, b) => a.nome_completo.localeCompare(b.nome_completo)),
        count: colaboradores.length
      }));
  }, [colaboradores]);

  // Filtrar por busca
  const filteredDepartamentos = useMemo(() => {
    if (!search) return departamentos;
    
    const searchLower = search.toLowerCase();
    return departamentos
      .map(dept => ({
        ...dept,
        colaboradores: dept.colaboradores.filter(c => 
          c.nome_completo.toLowerCase().includes(searchLower) ||
          c.cargo.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower)
        )
      }))
      .filter(dept => 
        dept.name.toLowerCase().includes(searchLower) || 
        dept.colaboradores.length > 0
      );
  }, [departamentos, search]);

  const totalColaboradores = colaboradores.filter(c => c.status === 'ativo').length;

  const toggleDepartment = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) {
      newExpanded.delete(deptName);
    } else {
      newExpanded.add(deptName);
    }
    setExpandedDepts(newExpanded);
  };

  const expandAll = () => {
    setExpandedDepts(new Set(departamentos.map(d => d.name)));
  };

  const collapseAll = () => {
    setExpandedDepts(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Organograma
          </h1>
          <p className="text-muted-foreground">
            Estrutura hierárquica da empresa - {empresaAtual?.razao_social || 'Todas as empresas'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <Users className="h-4 w-4 mr-1" />
            {totalColaboradores} colaboradores
          </Badge>
          <Badge variant="outline" className="text-sm">
            {departamentos.length} departamentos
          </Badge>
        </div>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar colaborador ou departamento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={viewMode} onValueChange={(v: unknown) => setViewMode(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hierarchy">Hierarquia</SelectItem>
                <SelectItem value="grid">Grade</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 border rounded-md">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm">{zoom}%</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setZoom(Math.min(150, zoom + 10))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={expandAll}>
              Expandir Tudo
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              Recolher Tudo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualização Hierárquica */}
      {viewMode === 'hierarchy' && (
        <div 
          className="space-y-4 transition-transform origin-top-left"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {/* Empresa no topo */}
          <Card className="border-primary/50 bg-primary/5 max-w-md mx-auto">
            <CardContent className="pt-4 text-center">
              <Building2 className="h-10 w-10 mx-auto text-primary mb-2" />
              <h3 className="font-bold text-lg">{empresaAtual?.razao_social || 'Empresa'}</h3>
              <p className="text-sm text-muted-foreground">{totalColaboradores} colaboradores</p>
            </CardContent>
          </Card>

          {/* Linha conectora */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-border" />
          </div>

          {/* Departamentos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDepartamentos.map((dept) => (
              <Card 
                key={dept.name}
                className={cn(
                  "transition-all cursor-pointer hover:shadow-lg",
                  expandedDepts.has(dept.name) && "ring-2 ring-primary"
                )}
              >
                <CardHeader 
                  className="pb-2 cursor-pointer"
                  onClick={() => toggleDepartment(dept.name)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      {expandedDepts.has(dept.name) ? (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      {dept.name}
                    </CardTitle>
                    <Badge variant="secondary">{dept.count}</Badge>
                  </div>
                </CardHeader>

                {expandedDepts.has(dept.name) && (
                  <CardContent className="pt-0">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {dept.colaboradores.map((colab) => (
                        <div 
                          key={colab.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColaborador(colab);
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors",
                            selectedColaborador?.id === colab.id && "bg-accent"
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{colab.nome_completo}</p>
                            <p className="text-xs text-muted-foreground truncate">{colab.cargo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Visualização em Grade */}
      {viewMode === 'grid' && (
        <div 
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
        >
          {filteredDepartamentos.flatMap(dept => 
            dept.colaboradores.map(colab => (
              <Card 
                key={colab.id}
                className={cn(
                  "hover:shadow-lg transition-all cursor-pointer",
                  selectedColaborador?.id === colab.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedColaborador(colab)}
              >
                <CardContent className="pt-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-sm truncate">{colab.nome_completo}</h4>
                  <p className="text-xs text-muted-foreground truncate">{colab.cargo}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {colab.departamento}
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal/Sidebar de detalhes do colaborador */}
      {selectedColaborador && (
        <div className="fixed inset-y-0 right-0 w-80 bg-background border-l shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Detalhes</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedColaborador(null)}
              >
                ✕
              </Button>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h4 className="font-bold text-lg">{selectedColaborador.nome_completo}</h4>
              <p className="text-muted-foreground">{selectedColaborador.cargo}</p>
              <Badge className="mt-2">{selectedColaborador.departamento}</Badge>
            </div>

            <div className="space-y-4">
              {selectedColaborador.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate">{selectedColaborador.email}</span>
                </div>
              )}
              {(selectedColaborador.celular || selectedColaborador.telefone) && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedColaborador.celular || selectedColaborador.telefone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedColaborador.local_trabalho || 'Não informado'}</span>
              </div>

              <div className="pt-4 border-t">
                <h5 className="text-sm font-medium mb-2">Informações Adicionais</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Matrícula:</span>
                    <p>{selectedColaborador.matricula || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contrato:</span>
                    <p className="uppercase">{selectedColaborador.tipo_contrato}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Admissão:</span>
                    <p>{new Date(selectedColaborador.data_admissao).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Jornada:</span>
                    <p>{selectedColaborador.jornada_semanal || 44}h/sem</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay quando sidebar está aberta */}
      {selectedColaborador && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSelectedColaborador(null)}
        />
      )}
    </div>
  );
}
