import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '@/components/ui/avatar';
const meta: Meta<typeof Avatar> = { title: 'UI/Avatar', component: Avatar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Avatar>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
