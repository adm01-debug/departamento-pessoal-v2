import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { FileCheck, Calendar } from 'lucide-react';

interface HomologacaoWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  desligamentoId?: string;
  colaboradorNome?: string;
  onSuccess?: () => void;
}

export const HomologacaoWizard = memo(function HomologacaoWizard({
  open,
  onOpenChange,
  desligamentoId,
  colaboradorNome,
  onSuccess,
}: HomologacaoWizardProps) {
  const [dataHomologacao, setDataHomologacao] = useState('');
  const [local, setLocal] = useState('');
  const [checklist, setChecklist] = useState({
    termoRescisao: false,
    trctAssinado: false,
    guiaSeguro: false,
    chaveConectividade: false,
    extratoCt: false,
    comprovantePagamento: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dataHomologacao) {
      toast.error('Informe a data da homologação');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Implementar lógica de homologação
      toast.success('Homologação agendada com sucesso!');
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao agendar homologação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Homologação de Rescisão
          </DialogTitle>
          {colaboradorNome && (
            <DialogDescription>
              Colaborador: {colaboradorNome}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataHomologacao">Data da Homologação</Label>
              <Input
                id="dataHomologacao"
                type="date"
                value={dataHomologacao}
                onChange={(e) => setDataHomologacao(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Sindicato, empresa..."
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Checklist de Documentos</Label>
            {Object.entries({
              termoRescisao: 'Termo de Rescisão',
              trctAssinado: 'TRCT Assinado',
              guiaSeguro: 'Guia do Seguro Desemprego',
              chaveConectividade: 'Chave de Conectividade',
              extratoCt: 'Extrato da Carteira de Trabalho',
              comprovantePagamento: 'Comprovante de Pagamento',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={checklist[key as keyof typeof checklist]}
                  onCheckedChange={(checked) =>
                    setChecklist((prev) => ({ ...prev, [key]: checked === true }))
                  }
                />
                <label htmlFor={key} className="text-sm cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Agendar Homologação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default HomologacaoWizard;
