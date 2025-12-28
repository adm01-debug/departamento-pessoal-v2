import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from '@/components/ui/tooltip';
const meta: Meta<typeof Tooltip> = { title: 'UI/Tooltip', component: Tooltip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tooltip>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
