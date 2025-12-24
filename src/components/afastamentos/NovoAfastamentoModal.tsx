/**
 * @fileoverview Modal para registro de novo afastamento
 * @module components/afastamentos/NovoAfastamentoModal
 */
import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NovoAfastamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colaboradorId?: string;
  onSuccess?: () => void;
}

const tiposAfastamento = [
  { value: 'atestado', label: 'Atestado Médico' },
  { value: 'licenca_maternidade', label: 'Licença Maternidade' },
  { value: 'licenca_paternidade', label: 'Licença Paternidade' },
  { value: 'acidente_trabalho', label: 'Acidente de Trabalho' },
  { value: 'auxilio_doenca', label: 'Auxílio Doença (INSS)' },
  { value: 'falta_justificada', label: 'Falta Justificada' },
  { value: 'falta_injustificada', label: 'Falta Injustificada' },
  { value: 'outros', label: 'Outros' },
];

export const NovoAfastamentoModal = memo(function NovoAfastamentoModal({
  open, onOpenChange, colaboradorId, onSuccess
}: NovoAfastamentoModalProps) {
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [motivo, setMotivo] = useState('');
  const [cid, setCid] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tipo || !dataInicio) return;
    setLoading(true);
    try {
      // API call here
      await new Promise(r => setTimeout(r, 1000));
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTipo('');
    setDataInicio(undefined);
    setDataFim(undefined);
    setMotivo('');
    setCid('');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Afastamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Tipo de Afastamento *</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
              <SelectContent>
                {tiposAfastamento.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dataInicio} onSelect={setDataInicio} /></PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Data Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, 'dd/MM/yyyy', { locale: ptBR }) : 'Indeterminado'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dataFim} onSelect={setDataFim} /></PopoverContent>
              </Popover>
            </div>
          </div>
          {(tipo === 'atestado' || tipo === 'auxilio_doenca') && (
            <div>
              <Label>CID (opcional)</Label>
              <Input value={cid} onChange={(e) => setCid(e.target.value)} placeholder="Ex: J11" />
            </div>
          )}
          <div>
            <Label>Observações</Label>
            <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Detalhes adicionais..." rows={3} />
          </div>
          <div>
            <Label>Anexar Documento</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Clique ou arraste o atestado</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!tipo || !dataInicio || loading}>
            {loading ? 'Salvando...' : 'Registrar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
