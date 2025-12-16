import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, Briefcase, Building2, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { departamentosDefault } from '@/types/colaborador';

interface NovaAdmissaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NovaAdmissaoData) => void;
}

export interface NovaAdmissaoData {
  candidatoNome: string;
  cargo: string;
  departamento: string;
  salarioProposto: number;
  dataPrevisao: Date;
  observacoes?: string;
  email?: string;
  telefone?: string;
}

export function NovaAdmissaoModal({ open, onOpenChange, onSubmit }: NovaAdmissaoModalProps) {
  const [formData, setFormData] = useState<Partial<NovaAdmissaoData>>({});
  const [dateOpen, setDateOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidatoNome || !formData.cargo || !formData.departamento || !formData.dataPrevisao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    onSubmit({
      candidatoNome: formData.candidatoNome,
      cargo: formData.cargo,
      departamento: formData.departamento,
      salarioProposto: formData.salarioProposto || 0,
      dataPrevisao: formData.dataPrevisao,
      observacoes: formData.observacoes,
      email: formData.email,
      telefone: formData.telefone,
    });

    setFormData({});
    onOpenChange(false);
    toast.success('Admissão criada com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Nova Admissão
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dados do Candidato */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="candidatoNome">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="candidatoNome"
                  placeholder="Nome do candidato"
                  value={formData.candidatoNome || ''}
                  onChange={(e) => setFormData({ ...formData, candidatoNome: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Dados da Vaga */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Dados da Vaga
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cargo">
                  Cargo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cargo"
                  placeholder="Ex: Analista de RH"
                  value={formData.cargo || ''}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="departamento">
                  Departamento <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentosDefault.map((dep) => (
                      <SelectItem key={dep} value={dep}>
                        {dep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="salario">Salário Proposto</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="salario"
                    type="number"
                    placeholder="0,00"
                    className="pl-9"
                    value={formData.salarioProposto || ''}
                    onChange={(e) => setFormData({ ...formData, salarioProposto: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label>
                  Data Prevista <span className="text-destructive">*</span>
                </Label>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataPrevisao && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataPrevisao
                        ? format(formData.dataPrevisao, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataPrevisao}
                      onSelect={(date) => {
                        setFormData({ ...formData, dataPrevisao: date });
                        setDateOpen(false);
                      }}
                      locale={ptBR}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre a admissão..."
              rows={3}
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Admissão</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
