/**
 * @fileoverview Modal para gerenciamento de benefícios
 * @module components/beneficios/BeneficioModal
 */
import { memo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Bus, Utensils, GraduationCap, Dumbbell, Baby, DollarSign } from 'lucide-react';

interface Beneficio {
  id?: string;
  tipo: string;
  nome: string;
  valorEmpresa?: number;
  valorColaborador?: number;
  ativo: boolean;
  descricao?: string;
}

interface BeneficioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficio?: Beneficio | null;
  onSuccess?: () => void;
}

const tiposBeneficio = [
  { value: 'saude', label: 'Plano de Saúde', icon: Heart },
  { value: 'vale_transporte', label: 'Vale Transporte', icon: Bus },
  { value: 'vale_alimentacao', label: 'Vale Alimentação', icon: Utensils },
  { value: 'vale_refeicao', label: 'Vale Refeição', icon: Utensils },
  { value: 'educacao', label: 'Auxílio Educação', icon: GraduationCap },
  { value: 'academia', label: 'Gympass/Academia', icon: Dumbbell },
  { value: 'creche', label: 'Auxílio Creche', icon: Baby },
  { value: 'outros', label: 'Outros', icon: DollarSign },
];

export const BeneficioModal = memo(function BeneficioModal({
  open, onOpenChange, beneficio, onSuccess
}: BeneficioModalProps) {
  const [form, setForm] = useState<Beneficio>({
    tipo: '', nome: '', valorEmpresa: 0, valorColaborador: 0, ativo: true
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!beneficio?.id;

  useEffect(() => {
    if (beneficio) {
      setForm(beneficio);
    } else {
      setForm({ tipo: '', nome: '', valorEmpresa: 0, valorColaborador: 0, ativo: true });
    }
  }, [beneficio, open]);

  const handleSubmit = async () => {
    if (!form.tipo || !form.nome) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const IconComponent = tiposBeneficio.find(t => t.value === form.tipo)?.icon || DollarSign;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {isEditing ? 'Editar Benefício' : 'Novo Benefício'}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="geral" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
          </TabsList>
          <TabsContent value="geral" className="space-y-4 mt-4">
            <div>
              <Label>Tipo *</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {tiposBeneficio.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      <span className="flex items-center gap-2"><t.icon className="h-4 w-4" />{t.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nome do Benefício *</Label>
              <Input value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} placeholder="Ex: Unimed Estadual" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Benefício Ativo</Label>
              <Switch checked={form.ativo} onCheckedChange={(v) => setForm({...form, ativo: v})} />
            </div>
          </TabsContent>
          <TabsContent value="valores" className="space-y-4 mt-4">
            <div>
              <Label>Valor Empresa (R$)</Label>
              <Input type="number" value={form.valorEmpresa || ''} onChange={(e) => setForm({...form, valorEmpresa: +e.target.value})} placeholder="0,00" />
            </div>
            <div>
              <Label>Desconto Colaborador (R$)</Label>
              <Input type="number" value={form.valorColaborador || ''} onChange={(e) => setForm({...form, valorColaborador: +e.target.value})} placeholder="0,00" />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Custo líquido empresa:</p>
              <p className="text-lg font-semibold">R$ {((form.valorEmpresa || 0) - (form.valorColaborador || 0)).toFixed(2)}</p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!form.tipo || !form.nome || loading}>
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
