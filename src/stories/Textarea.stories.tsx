import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '@/components/ui/textarea';
const meta: Meta<typeof Textarea> = { title: 'UI/Textarea', component: Textarea };
export default meta;
type Story = StoryObj<typeof Textarea>;
export const Default: Story = { args: { placeholder: 'Digite aqui...' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Desabilitado' } };
