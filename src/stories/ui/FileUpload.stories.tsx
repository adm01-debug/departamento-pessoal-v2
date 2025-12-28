import type { Meta, StoryObj } from '@storybook/react';
import { FileUpload } from '@/components/ui/FileUpload';

const meta: Meta<typeof FileUpload> = {
  title: 'UI/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = { args: {} };
