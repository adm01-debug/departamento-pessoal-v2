import type { Meta, StoryObj } from '@storybook/react';
import { Sonner } from '@/components/ui/sonner';
const meta: Meta<typeof Sonner> = { title: 'UI/Sonner', component: Sonner, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Sonner>;
export const Default: Story = { args: {} };
