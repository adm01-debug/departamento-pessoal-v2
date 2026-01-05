import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
const meta: Meta<typeof Textarea> = { title: 'UI/Textarea', component: Textarea, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Textarea>;
export const Default: Story = { args: { placeholder: 'Digite sua mensagem...' } };
export const WithValue: Story = { args: { value: 'Texto de exemplo com várias linhas\nSegunda linha', readOnly: true } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Desabilitado' } };
