import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { colaboradorSchema, ColaboradorFormData } from '@/schemas/colaborador';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { maskCPF, maskPhone } from '@/lib/masks';

interface Props {
  defaultValues?: Partial<ColaboradorFormData>;
  cargos: { id: string; nome: string }[];
  departamentos: { id: string; nome: string }[];
  onSubmit: (data: ColaboradorFormData) => void;
  onCancel: () => void;
}

export function ColaboradorForm({ defaultValues, cargos, departamentos, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ColaboradorFormData>({
    resolver: zodResolver(colaboradorSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nome*</Label>
          <Input {...register('nome')} placeholder="Nome completo" />
          {errors.nome && <span className="text-sm text-destructive">{errors.nome.message}</span>}
        </div>
        <div>
          <Label>CPF*</Label>
          <Input {...register('cpf')} placeholder="000.000.000-00" onChange={e => setValue('cpf', maskCPF(e.target.value))} />
          {errors.cpf && <span className="text-sm text-destructive">{errors.cpf.message}</span>}
        </div>
        <div>
          <Label>Email*</Label>
          <Input type="email" {...register('email')} />
          {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
        </div>
        <div>
          <Label>Telefone*</Label>
          <Input {...register('telefone')} onChange={e => setValue('telefone', maskPhone(e.target.value))} />
        </div>
        <div>
          <Label>Cargo*</Label>
          <Select onValueChange={v => setValue('cargoId', v)} defaultValue={defaultValues?.cargoId}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {cargos.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Departamento*</Label>
          <Select onValueChange={v => setValue('departamentoId', v)} defaultValue={defaultValues?.departamentoId}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {departamentos.map(d => <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Data Admissão*</Label>
          <Input type="date" {...register('dataAdmissao')} />
        </div>
        <div>
          <Label>Salário*</Label>
          <Input type="number" step="0.01" {...register('salario', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}