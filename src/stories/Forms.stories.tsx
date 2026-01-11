// V15-122: src/stories/Forms.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const meta: Meta = {
  title: 'Components/Forms',
  parameters: { layout: 'centered' },
};

export default meta;

export const TextInput: StoryObj = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="name">Nome</Label>
      <Input id="name" placeholder="Digite seu nome" />
    </div>
  ),
};

export const InputWithError: StoryObj = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" className="border-red-500" placeholder="email@exemplo.com" />
      <p className="text-sm text-red-500">Email inválido</p>
    </div>
  ),
};

export const SelectField: StoryObj = {
  render: () => (
    <div className="space-y-2 w-80">
      <Label>Departamento</Label>
      <Select>
        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="rh">RH</SelectItem>
          <SelectItem value="ti">TI</SelectItem>
          <SelectItem value="financeiro">Financeiro</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const CompleteForm: StoryObj = {
  render: () => (
    <form className="space-y-4 w-96 p-6 border rounded-lg">
      <h2 className="text-lg font-semibold">Cadastro de Colaborador</h2>
      <div className="space-y-2">
        <Label htmlFor="form-nome">Nome Completo</Label>
        <Input id="form-nome" placeholder="João Silva" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-cpf">CPF</Label>
        <Input id="form-cpf" placeholder="000.000.000-00" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="joao@empresa.com" />
      </div>
      <Button type="submit" className="w-full">Cadastrar</Button>
    </form>
  ),
};
