import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer } from '@/components/ui/chart';
const meta: Meta<typeof ChartContainer> = { title: 'UI/Chart', component: ChartContainer };
export default meta;
type Story = StoryObj<typeof ChartContainer>;
export const Default: Story = { args: { config: {}, children: <div>Chart content</div> } };
