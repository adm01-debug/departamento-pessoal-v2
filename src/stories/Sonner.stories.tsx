import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '@/components/ui/sonner';
const meta: Meta<typeof Toaster> = { title: 'UI/Sonner', component: Toaster };
export default meta;
type Story = StoryObj<typeof Toaster>;
export const Default: Story = {};
