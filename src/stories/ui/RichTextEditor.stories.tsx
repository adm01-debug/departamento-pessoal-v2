import type { Meta, StoryObj } from '@storybook/react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'UI/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = { args: {} };
