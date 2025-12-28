import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '@/components/ui/dialog';
const meta: Meta<typeof Dialog> = { title: 'UI/Dialog', component: Dialog, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Dialog>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
