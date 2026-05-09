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
import { Settings2, Plus, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function RubricasDialog() {
  const [isOpen, setIsOpen] = useState(false);
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
            <Button size="sm" className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Nova Rubrica
            </Button>
          </div>
        </DialogHeader>

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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
