import type { Meta, StoryObj } from '@storybook/react';
import { ColorPicker } from '@/components/ui/ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'UI/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = { args: {} };
