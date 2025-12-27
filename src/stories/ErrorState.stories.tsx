import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from '@/components/feedback/ErrorState';
const meta: Meta<typeof ErrorState> = { title: 'Feedback/ErrorState', component: ErrorState };
export default meta;
type Story = StoryObj<typeof ErrorState>;
export const Default: Story = { args: { title: 'Erro', message: 'Ocorreu um erro inesperado' } };
export const WithRetry: Story = { args: { title: 'Falha na conexão', message: 'Verifique sua internet', onRetry: () => {} } };
