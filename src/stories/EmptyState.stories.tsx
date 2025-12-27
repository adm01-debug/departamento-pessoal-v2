import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '@/components/feedback/EmptyState';
const meta: Meta<typeof EmptyState> = { title: 'Feedback/EmptyState', component: EmptyState };
export default meta;
type Story = StoryObj<typeof EmptyState>;
export const Default: Story = { args: { title: 'Nenhum resultado', description: 'Não encontramos o que você procura' } };
export const WithAction: Story = { args: { title: 'Lista vazia', description: 'Adicione um item', actionLabel: 'Adicionar', onAction: () => {} } };
