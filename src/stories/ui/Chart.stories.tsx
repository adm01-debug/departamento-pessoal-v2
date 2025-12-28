import type { Meta, StoryObj } from '@storybook/react';
import { Chart } from '@/components/ui/chart';
const meta: Meta<typeof Chart> = { title: 'UI/Chart', component: Chart, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Chart>;
export const Default: Story = { args: {} };
