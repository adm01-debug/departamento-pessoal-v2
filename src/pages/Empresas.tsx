/**
 * @fileoverview Página de Gestão de Empresas (Multi-tenant)
 * @module pages/Empresas
 * @version V8.4 - Implementação completa
 */
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Building,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useEmpresas, Empresa } from '@/hooks/useEmpresas';
import { formatarCNPJ, formatarTelefone, formatarCEP } from '@/lib/masks';

// ============================================
// TIPOS
// ============================================

interface EmpresaFormData {
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  email: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  regime_tributario: 'simples' | 'lucro_presumido' | 'lucro_real';
  ativa: boolean;
}

const INITIAL_FORM: EmpresaFormData = {
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  inscricao_municipal: '',
  email: '',
  telefone: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  regime_tributario: 'simples',
  ativa: true,
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const EmpresasPage = memo(function EmpresasPage() {
  useEffect(() => {
    document.title = 'Empresas | DP System';
  }, []);

  const { 
    empresas, 
    loading, 
    empresaAtual,
    setEmpresaAtual,
    createEmpresa, 
    updateEmpresa, 
    deleteEmpresa 
  } = useEmpresas();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);
  const [formData, setFormData] = useState<EmpresaFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Empresas filtradas
  const empresasFiltradas = useMemo(() => {
    if (!searchTerm) return empresas;
    const term = searchTerm.toLowerCase();
    return empresas.filter(e => 
      e.razao_social?.toLowerCase().includes(term) ||
      e.nome_fantasia?.toLowerCase().includes(term) ||
      e.cnpj?.includes(term)
    );
  }, [empresas, searchTerm]);

  // Estatísticas
  const stats = useMemo(() => ({
    total: empresas.length,
    ativas: empresas.filter(e => e.ativa !== false).length,
    inativas: empresas.filter(e => e.ativa === false).length,
  }), [empresas]);

  // Abrir modal para nova empresa
  const handleNovaEmpresa = useCallback(() => {
    setEditingEmpresa(null);
    setFormData(INITIAL_FORM);
    setModalOpen(true);
  }, []);

  // Abrir modal para editar
  const handleEditar = useCallback((empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setFormData({
      razao_social: empresa.razao_social || '',
      nome_fantasia: empresa.nome_fantasia || '',
      cnpj: empresa.cnpj || '',
      inscricao_estadual: empresa.inscricao_estadual || '',
      inscricao_municipal: empresa.inscricao_municipal || '',
      email: empresa.email || '',
      telefone: empresa.telefone || '',
      endereco: empresa.endereco || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      estado: empresa.estado || '',
      cep: empresa.cep || '',
      regime_tributario: empresa.regime_tributario || 'simples',
      ativa: empresa.ativa !== false,
    });
    setModalOpen(true);
  }, []);

  // Salvar empresa
  const handleSalvar = useCallback(async () => {
    if (!formData.razao_social || !formData.cnpj) {
      toast.error('Razão Social e CNPJ são obrigatórios');
      return;
    }

    setSaving(true);
    try {
      if (editingEmpresa) {
        await updateEmpresa(editingEmpresa.id, formData);
        toast.success('Empresa atualizada com sucesso!');
      } else {
        await createEmpresa(formData);
        toast.success('Empresa cadastrada com sucesso!');
      }
      setModalOpen(false);
      setFormData(INITIAL_FORM);
    } catch (error) {
      toast.error('Erro ao salvar empresa');
    } finally {
      setSaving(false);
    }
  }, [formData, editingEmpresa, createEmpresa, updateEmpresa]);

  // Excluir empresa
  const handleExcluir = useCallback(async (id: string) => {
    try {
      await deleteEmpresa(id);
      toast.success('Empresa excluída com sucesso!');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Erro ao excluir empresa');
    }
  }, [deleteEmpresa]);

  // Selecionar empresa ativa
  const handleSelecionarEmpresa = useCallback((empresa: Empresa) => {
    setEmpresaAtual(empresa);
    toast.success(`Empresa ${empresa.nome_fantasia || empresa.razao_social} selecionada`);
  }, [setEmpresaAtual]);

  // Regime tributário badge
  const getRegimeBadge = (regime: string) => {
    const styles: Record<string, string> = {
      simples: 'bg-green-100 text-green-800',
      lucro_presumido: 'bg-blue-100 text-blue-800',
      lucro_real: 'bg-purple-100 text-purple-800',
    };
    const labels: Record<string, string> = {
      simples: 'Simples Nacional',
      lucro_presumido: 'Lucro Presumido',
      lucro_real: 'Lucro Real',
    };
    return <Badge className={styles[regime] || 'bg-gray-100'}>{labels[regime] || regime}</Badge>;
  };

  return (
    <>
      <SEOHead title="Empresas" description="Gestão de empresas do sistema" />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Empresas
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie as empresas cadastradas no sistema
            </p>
          </div>
          <Button onClick={handleNovaEmpresa}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Empresas</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ativas</p>
                  <p className="text-2xl font-bold">{stats.ativas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inativas</p>
                  <p className="text-2xl font-bold">{stats.inativas}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Empresa Selecionada */}
        {empresaAtual && (
          <Card className="border-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Empresa Ativa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{empresaAtual.nome_fantasia || empresaAtual.razao_social}</p>
                  <p className="text-sm text-muted-foreground">{formatarCNPJ(empresaAtual.cnpj || '')}</p>
                </div>
                {getRegimeBadge(empresaAtual.regime_tributario || 'simples')}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
            <CardDescription>
              {empresasFiltradas.length} empresa(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : empresasFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma empresa encontrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Regime</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresasFiltradas.map((empresa) => (
                    <TableRow 
                      key={empresa.id}
                      className={empresaAtual?.id === empresa.id ? 'bg-primary/5' : ''}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{empresa.nome_fantasia || empresa.razao_social}</p>
                          {empresa.nome_fantasia && (
                            <p className="text-sm text-muted-foreground">{empresa.razao_social}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatarCNPJ(empresa.cnpj || '')}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {empresa.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {empresa.email}
                            </div>
                          )}
                          {empresa.telefone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {formatarTelefone(empresa.telefone)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRegimeBadge(empresa.regime_tributario || 'simples')}</TableCell>
                      <TableCell>
                        <Badge variant={empresa.ativa !== false ? 'default' : 'secondary'}>
                          {empresa.ativa !== false ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleSelecionarEmpresa(empresa)}>
                              <Globe className="h-4 w-4 mr-2" />
                              Selecionar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditar(empresa)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteConfirm(empresa.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de Cadastro/Edição */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da empresa
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razao_social">Razão Social *</Label>
                  <Input
                    id="razao_social"
                    value={formData.razao_social}
                    onChange={(e) => setFormData(prev => ({ ...prev, razao_social: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                  <Input
                    id="nome_fantasia"
                    value={formData.nome_fantasia}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_fantasia: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formatarCNPJ(formData.cnpj)}
                    onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value.replace(/\D/g, '') }))}
                    maxLength={18}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input
                    id="ie"
                    value={formData.inscricao_estadual}
                    onChange={(e) => setFormData(prev => ({ ...prev, inscricao_estadual: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="im">Inscrição Municipal</Label>
                  <Input
                    id="im"
                    value={formData.inscricao_municipal}
                    onChange={(e) => setFormData(prev => ({ ...prev, inscricao_municipal: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formatarTelefone(formData.telefone)}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    maxLength={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formatarCEP(formData.cep)}
                    onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value.replace(/\D/g, '') }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSalvar} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmação de Exclusão */}
        <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirm && handleExcluir(deleteConfirm)}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
});

export default EmpresasPage;
