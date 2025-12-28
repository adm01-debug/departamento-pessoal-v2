import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@/components/ui/dropdown';
const meta: Meta<typeof Dropdown> = { title: 'UI/Dropdown', component: Dropdown, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Dropdown>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
