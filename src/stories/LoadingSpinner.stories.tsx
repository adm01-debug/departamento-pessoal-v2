import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
const meta: Meta<typeof LoadingSpinner> = { title: 'Feedback/LoadingSpinner', component: LoadingSpinner };
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;
export const Default: Story = {};
export const Large: Story = { args: { size: 'lg' } };
export const Small: Story = { args: { size: 'sm' } };
