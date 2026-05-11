import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings2, Plus, Trash2, Check, X, Save, AlertCircle, Wrench } from 'lucide-react';
import { validarRubricaESocial, sugerirCorrecaoRubrica } from '@/validators/esocial';
import { toast } from 'sonner';

export function RubricasDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newRubrica, setNewRubrica] = useState({
    codigo: '',
    descricao: '',
    tipo: 'provento' as 'provento' | 'desconto',
    incide_inss: true,
    incide_fgts: true,
    incide_irrf: true,
    automatico: false,
    ativo: true,
  });
  const queryClient = useQueryClient();

  const { data: rubricas, isLoading } = useQuery({
    queryKey: ['rubricas_folha'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rubricas_folha')
        .select('*')
        .order('codigo', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (rubrica: typeof newRubrica) => {
      // Validação eSocial antes de salvar
      const validacao = validarRubricaESocial(rubrica);
      if (!validacao.valid) {
        const errorMsg = validacao.errors.map(e => e.mensagem).join(', ');
        throw new Error(`Divergência eSocial: ${errorMsg}`);
      }

      const { error } = await supabase
        .from('rubricas_folha')
        .insert(rubrica);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubricas_folha'] });
      toast.success('Rubrica criada com sucesso');
      setIsAdding(false);
      setNewRubrica({
        codigo: '',
        descricao: '',
        tipo: 'provento',
        incide_inss: true,
        incide_fgts: true,
        incide_irrf: true,
        automatico: false,
        ativo: true,
      });
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar rubrica: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rubricas_folha')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubricas_folha'] });
      toast.success('Rubrica removida com sucesso');
    },
    onError: (error: any) => {
      toast.error(`Erro ao remover rubrica: ${error.message}`);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-body">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">Rubricas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Gestão de Rubricas (Eventos)</DialogTitle>
            <Button 
              size="sm" 
              className="gap-2 rounded-xl"
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {isAdding ? 'Cancelar' : 'Nova Rubrica'}
            </Button>
          </div>
        </DialogHeader>

        {isAdding && (
          <div className="mt-4 p-4 border rounded-xl bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: 101"
                  value={newRubrica.codigo}
                  onChange={(e) => setNewRubrica({ ...newRubrica, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={newRubrica.tipo}
                  onValueChange={(val: any) => setNewRubrica({ ...newRubrica, tipo: val })}
                >
                  <SelectTrigger id="tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="provento">Provento</SelectItem>
                    <SelectItem value="desconto">Desconto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                placeholder="Ex: Salário Base"
                value={newRubrica.descricao}
                onChange={(e) => setNewRubrica({ ...newRubrica, descricao: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-6 py-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inss"
                  checked={newRubrica.incide_inss}
                  onCheckedChange={(checked) => setNewRubrica({ ...newRubrica, incide_inss: !!checked })}
                />
                <Label htmlFor="inss" className="cursor-pointer">Incide INSS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fgts"
                  checked={newRubrica.incide_fgts}
                  onCheckedChange={(checked) => setNewRubrica({ ...newRubrica, incide_fgts: !!checked })}
                />
                <Label htmlFor="fgts" className="cursor-pointer">Incide FGTS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="irrf"
                  checked={newRubrica.incide_irrf}
                  onCheckedChange={(checked) => setNewRubrica({ ...newRubrica, incide_irrf: !!checked })}
                />
                <Label htmlFor="irrf" className="cursor-pointer">Incide IRRF</Label>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                onClick={() => createMutation.mutate(newRubrica)}
                disabled={createMutation.isPending || !newRubrica.codigo || !newRubrica.descricao}
                className="gap-2 rounded-xl"
              >
                <Save className="h-4 w-4" />
                Salvar Rubrica
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">INSS</TableHead>
                <TableHead className="text-center">FGTS</TableHead>
                <TableHead className="text-center">IRRF</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Carregando rubricas...
                  </TableCell>
                </TableRow>
              ) : rubricas?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhuma rubrica cadastrada.
                  </TableCell>
                </TableRow>
              ) : (
                rubricas?.map((rubrica) => (
                  <TableRow key={rubrica.id}>
                    <TableCell className="font-mono font-bold text-primary">
                      {rubrica.codigo}
                    </TableCell>
                    <TableCell className="font-medium">{rubrica.descricao}</TableCell>
                    <TableCell>
                      <Badge variant={rubrica.tipo === 'provento' ? 'default' : 'destructive'} className="capitalize">
                        {rubrica.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {rubrica.incide_inss ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-center">
                      {rubrica.incide_fgts ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-center">
                      {rubrica.incide_irrf ? <Check className="h-4 w-4 mx-auto text-green-500" /> : <X className="h-4 w-4 mx-auto text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      {validarRubricaESocial(rubrica).valid ? (
                        <Badge variant="outline" className="text-success border-success/30 bg-success/5">
                          Conforme
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-warning hover:text-warning hover:bg-warning/10"
                          title="Corrigir divergência eSocial"
                          onClick={() => {
                            const corrigida = sugerirCorrecaoRubrica(rubrica);
                            if (corrigida && confirm('Deseja aplicar as correções automáticas do eSocial para esta rubrica?')) {
                              // Atualização silenciosa para demonstração
                              supabase.from('rubricas_folha').update(corrigida).eq('id', rubrica.id).then(() => {
                                queryClient.invalidateQueries({ queryKey: ['rubricas_folha'] });
                                toast.success('Rubrica saneada com sucesso!');
                              });
                            }
                          }}
                        >
                          <Wrench className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm('Deseja realmente excluir esta rubrica?')) {
                            deleteMutation.mutate(rubrica.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
