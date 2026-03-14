import { useState, memo } from 'react';
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
import { CalendarIcon, User, Briefcase, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { departamentosDefault } from '@/types/colaborador';
import { MaskedInput } from '@/components/ui/masked-input';
import { validateCPF, unmask } from '@/lib/masks';

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
  cpf?: string;
  dataNascimento?: Date;
  sexo?: string;
  email?: string;
  telefone?: string;
  estadoCivil?: string;
  nomeMae?: string;
}

const estadosCivis = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'separado', label: 'Separado(a)' },
  { value: 'uniao_estavel', label: 'União Estável' },
];

export const NovaAdmissaoModal = memo(function NovaAdmissaoModal({ open, onOpenChange, onSubmit }: NovaAdmissaoModalProps) {
  const [formData, setFormData] = useState<Partial<NovaAdmissaoData>>({});
  const [dateOpen, setDateOpen] = useState(false);
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const [cpfError, setCpfError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [telefoneError, setTelefoneError] = useState<string | null>(null);

  const validateCpfField = (cpf: string) => {
    if (!cpf || unmask(cpf).length === 0) {
      setCpfError(null);
      return true;
    }
    if (unmask(cpf).length < 11) {
      setCpfError('CPF incompleto');
      return false;
    }
    if (!validateCPF(cpf)) {
      setCpfError('CPF inválido - dígitos verificadores incorretos');
      return false;
    }
    setCpfError(null);
    return true;
  };

  const validateEmailField = (email: string) => {
    if (!email || email.trim().length === 0) {
      setEmailError(null);
      return true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('E-mail inválido');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validateTelefoneField = (telefone: string) => {
    if (!telefone || unmask(telefone).length === 0) {
      setTelefoneError(null);
      return true;
    }
    const digits = unmask(telefone);
    if (digits.length < 10) {
      setTelefoneError('Telefone incompleto');
      return false;
    }
    if (digits.length > 11) {
      setTelefoneError('Telefone inválido');
      return false;
    }
    setTelefoneError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidatoNome || !formData.cargo || !formData.departamento || !formData.dataPrevisao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar CPF se preenchido
    if (formData.cpf && !validateCpfField(formData.cpf)) {
      toast.error('CPF inválido');
      return;
    }

    // Validar e-mail se preenchido
    if (formData.email && !validateEmailField(formData.email)) {
      toast.error('E-mail inválido');
      return;
    }

    // Validar telefone se preenchido
    if (formData.telefone && !validateTelefoneField(formData.telefone)) {
      toast.error('Telefone inválido');
      return;
    }

    onSubmit({
      candidatoNome: formData.candidatoNome,
      cargo: formData.cargo,
      departamento: formData.departamento,
      salarioProposto: formData.salarioProposto ?? 0,
      dataPrevisao: formData.dataPrevisao,
      observacoes: formData.observacoes,
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento,
      sexo: formData.sexo,
      email: formData.email,
      telefone: formData.telefone,
      estadoCivil: formData.estadoCivil,
      nomeMae: formData.nomeMae,
    });

    setFormData({});
    onOpenChange(false);
    toast.success('Admissão criada com sucesso!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Nova Admissão
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Candidato */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Dados Pessoais
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="candidatoNome">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="candidatoNome"
                  placeholder="Nome do candidato"
                  value={formData.candidatoNome ?? ''}
                  onChange={(e) => setFormData({ ...formData, candidatoNome: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <MaskedInput
                  id="cpf"
                  mask="cpf"
                  placeholder="000.000.000-00"
                  value={formData.cpf ?? ''}
                  onChange={(e) => {
                    setFormData({ ...formData, cpf: e.target.value });
                    if (cpfError) setCpfError(null);
                  }}
                  onBlur={(e) => validateCpfField(e.target.value)}
                  className={cpfError ? 'border-destructive' : ''}
                />
                {cpfError && (
                  <p className="text-xs text-destructive mt-1">{cpfError}</p>
                )}
              </div>

              <div>
                <Label>Data de Nascimento</Label>
                <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dataNascimento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dataNascimento
                        ? format(formData.dataNascimento, "dd/MM/yyyy", { locale: ptBR })
                        : "Selecione"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.dataNascimento}
                      onSelect={(date) => {
                        setFormData({ ...formData, dataNascimento: date });
                        setBirthDateOpen(false);
                      }}
                      locale={ptBR}
                      disabled={(date) => date > new Date()}
                      captionLayout="dropdown"
                      fromYear={1950}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={formData.sexo}
                  onValueChange={(value) => setFormData({ ...formData, sexo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select
                  value={formData.estadoCivil}
                  onValueChange={(value) => setFormData({ ...formData, estadoCivil: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosCivis.map((ec) => (
                      <SelectItem key={ec.value} value={ec.value}>
                        {ec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="nomeMae">Nome da Mãe</Label>
                <Input
                  id="nomeMae"
                  placeholder="Nome completo da mãe"
                  value={formData.nomeMae ?? ''}
                  onChange={(e) => setFormData({ ...formData, nomeMae: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={formData.email ?? ''}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (emailError) setEmailError(null);
                  }}
                  onBlur={(e) => validateEmailField(e.target.value)}
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && (
                  <p className="text-xs text-destructive mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <MaskedInput
                  id="telefone"
                  mask="telefone"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone ?? ''}
                  onChange={(e) => {
                    setFormData({ ...formData, telefone: e.target.value });
                    if (telefoneError) setTelefoneError(null);
                  }}
                  onBlur={(e) => validateTelefoneField(e.target.value)}
                  className={telefoneError ? 'border-destructive' : ''}
                />
                {telefoneError && (
                  <p className="text-xs text-destructive mt-1">{telefoneError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Dados da Vaga */}
          <div className="space-y-4">
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
                  value={formData.cargo ?? ''}
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
                    value={formData.salarioProposto ?? ''}
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
              value={formData.observacoes ?? ''}
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
});