import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from '@/components/ui/TimePicker';

/**
 * TimePicker Component
 * 
 * Componente de ui para o sistema de Departamento Pessoal.
 */
const meta: Meta<typeof TimePicker> = {
  title: 'ui/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Documentação do componente TimePicker' } },
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text', description: 'Classes CSS adicionais' },
    variant: { control: 'select', options: ['default', 'outline', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const WithContent: Story = { args: { children: 'Conteúdo de exemplo' } };
export const Interactive: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = canvasElement;
    // Interações do componente
  },
};
