import type { Meta, StoryObj } from '@storybook/react';
import { Spacer } from '@/components/layout/Spacer';

/**
 * Spacer Component
 * 
 * Componente de layout para o sistema de Departamento Pessoal.
 */
const meta: Meta<typeof Spacer> = {
  title: 'layout/Spacer',
  component: Spacer,
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Documentação do componente Spacer' } },
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
