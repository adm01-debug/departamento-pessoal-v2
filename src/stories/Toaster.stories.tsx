import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '@/components/ui/toaster';
const meta: Meta<typeof Toaster> = { title: 'UI/Toaster', component: Toaster };
export default meta;
type Story = StoryObj<typeof Toaster>;
export const Default: Story = {};
