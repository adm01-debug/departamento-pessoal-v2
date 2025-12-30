import { useState, memo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaskedInput } from "@/components/ui/masked-input";
import { Textarea } from "@/components/ui/textarea";
import { validateCPF, unmask } from "@/lib/masks";
import { toast } from "sonner";

interface Admissao {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  data_prevista: string;
  salario_proposto: number;
  etapa: string;
  cpf?: string | null;
  data_nascimento?: string | null;
  sexo?: string | null;
  email?: string | null;
  telefone?: string | null;
  estado_civil?: string | null;
  nome_mae?: string | null;
  observacoes?: string | null;
}

interface EditarAdmissaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admissao: Admissao | null;
  onSave: (id: string, data: Partial<Admissao>) => void;
}

export const EditarAdmissaoModal = memo(function EditarAdmissaoModal({ open, onOpenChange, admissao, onSave }: EditarAdmissaoModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    departamento: "",
    data_prevista: "",
    salario_proposto: 0,
    cpf: "",
    data_nascimento: "",
    sexo: "",
    email: "",
    telefone: "",
    estado_civil: "solteiro",
    nome_mae: "",
    observacoes: "",
  });
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

  useEffect(() => {
    if (admissao) {
      setFormData({
        nome: admissao.nome || "",
        cargo: admissao.cargo || "",
        departamento: admissao.departamento || "",
        data_prevista: admissao.data_prevista || "",
        salario_proposto: admissao.salario_proposto ?? 0,
        cpf: admissao.cpf || "",
        data_nascimento: admissao.data_nascimento || "",
        sexo: admissao.sexo || "",
        email: admissao.email || "",
        telefone: admissao.telefone || "",
        estado_civil: admissao.estado_civil || "solteiro",
        nome_mae: admissao.nome_mae || "",
        observacoes: admissao.observacoes || "",
      });
    }
  }, [admissao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (admissao) {
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
      onSave(admissao.id, formData);
      onOpenChange(false);
    }
  };

  const departamentos = [
    "Administrativo", "Comercial", "Financeiro", "RH", "TI", 
    "Operações", "Marketing", "Logística", "Produção", "Jurídico"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Admissão</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Cargo */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dados do Cargo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento *</Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) => setFormData({ ...formData, departamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((dep) => (
                      <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salario_proposto">Salário Proposto *</Label>
                <Input
                  id="salario_proposto"
                  type="number"
                  step="0.01"
                  value={formData.salario_proposto}
                  onChange={(e) => setFormData({ ...formData, salario_proposto: parseFloat(e.target.value) ?? 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_prevista">Data Prevista *</Label>
                <Input
                  id="data_prevista"
                  type="date"
                  value={formData.data_prevista}
                  onChange={(e) => setFormData({ ...formData, data_prevista: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Dados Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <MaskedInput
                  id="cpf"
                  mask="cpf"
                  value={formData.cpf}
                  onChange={(e) => {
                    setFormData({ ...formData, cpf: e.target.value });
                    if (cpfError) setCpfError(null);
                  }}
                  onBlur={(e) => validateCpfField(e.target.value)}
                  placeholder="000.000.000-00"
                  className={cpfError ? 'border-destructive' : ''}
                />
                {cpfError && (
                  <p className="text-xs text-destructive mt-1">{cpfError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
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
              <div className="space-y-2">
                <Label htmlFor="estado_civil">Estado Civil</Label>
                <Select
                  value={formData.estado_civil}
                  onValueChange={(value) => setFormData({ ...formData, estado_civil: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                    <SelectItem value="casado">Casado(a)</SelectItem>
                    <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                    <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                    <SelectItem value="separado">Separado(a)</SelectItem>
                    <SelectItem value="uniao_estavel">União Estável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome_mae">Nome da Mãe *</Label>
                <Input
                  id="nome_mae"
                  value={formData.nome_mae}
                  onChange={(e) => setFormData({ ...formData, nome_mae: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (emailError) setEmailError(null);
                  }}
                  onBlur={(e) => validateEmailField(e.target.value)}
                  placeholder="email@exemplo.com"
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && (
                  <p className="text-xs text-destructive mt-1">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <MaskedInput
                  id="telefone"
                  mask="phone"
                  value={formData.telefone}
                  onChange={(e) => {
                    setFormData({ ...formData, telefone: e.target.value });
                    if (telefoneError) setTelefoneError(null);
                  }}
                  onBlur={(e) => validateTelefoneField(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className={telefoneError ? 'border-destructive' : ''}
                />
                {telefoneError && (
                  <p className="text-xs text-destructive mt-1">{telefoneError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});