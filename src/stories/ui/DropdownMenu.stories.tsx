import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = { args: {} };
