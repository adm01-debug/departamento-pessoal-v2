import type { Meta, StoryObj } from '@storybook/react';
import { MaskedInput } from '@/components/form/MaskedInput';
const meta: Meta<typeof MaskedInput> = { title: 'Form/MaskedInput', component: MaskedInput };
export default meta;
type Story = StoryObj<typeof MaskedInput>;
export const CPF: Story = { args: { mask: 'cpf', placeholder: '000.000.000-00' } };
export const CNPJ: Story = { args: { mask: 'cnpj', placeholder: '00.000.000/0000-00' } };
