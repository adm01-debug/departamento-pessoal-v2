import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/ui/select';
const meta: Meta<typeof Select> = { title: 'UI/Select', component: Select, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Select>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
