import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/ui/toggle';
const meta: Meta<typeof Toggle> = { title: 'UI/Toggle', component: Toggle };
export default meta;
type Story = StoryObj<typeof Toggle>;
export const Default: Story = { args: { children: 'Toggle' } };
export const Pressed: Story = { args: { pressed: true, children: 'Pressed' } };
