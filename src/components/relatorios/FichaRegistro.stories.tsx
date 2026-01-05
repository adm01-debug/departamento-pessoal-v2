import type { Meta, StoryObj } from '@storybook/react';
import { FichaRegistro } from './FichaRegistro';
const meta: Meta<typeof FichaRegistro> = { title: 'Relatorios/FichaRegistro', component: FichaRegistro, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof FichaRegistro>;
export const Default: Story = { args: { colaborador: { nome: 'João da Silva Santos', cpf: '123.456.789-00', rg: '12.345.678-9', dataNascimento: '15/05/1990', endereco: 'Rua das Flores, 123 - Centro - São Paulo/SP', cargo: 'Desenvolvedor Senior', departamento: 'Tecnologia', dataAdmissao: '15/01/2023', salario: 8000, ctps: '123456 / 001-SP', pis: '123.45678.90-1' } } };
