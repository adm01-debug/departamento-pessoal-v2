import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from '@/components/ui/togglegroup';
const meta: Meta<typeof ToggleGroup> = { title: 'UI/ToggleGroup', component: ToggleGroup, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ToggleGroup>;
export const Default: Story = { args: {} };
