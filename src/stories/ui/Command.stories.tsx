import type { Meta, StoryObj } from '@storybook/react';
import { Command } from '@/components/ui/command';
const meta: Meta<typeof Command> = { title: 'UI/Command', component: Command, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Command>;
export const Default: Story = { args: {} };
