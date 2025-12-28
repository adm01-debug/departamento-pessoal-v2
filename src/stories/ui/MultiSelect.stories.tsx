import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from '@/components/ui/MultiSelect';

const meta: Meta<typeof MultiSelect> = {
  title: 'UI/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

export const Default: Story = { args: {} };
