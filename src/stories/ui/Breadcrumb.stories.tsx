import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
const meta: Meta<typeof Breadcrumb> = { title: 'UI/Breadcrumb', component: Breadcrumb, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Breadcrumb>;
export const Default: Story = { args: {} };
