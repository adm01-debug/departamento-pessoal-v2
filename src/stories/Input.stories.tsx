import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta: Meta<typeof Input> = { title: 'UI/Input', component: Input, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text...' } };
export const WithLabel: Story = { render: () => (<div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="email@example.com" /></div>) };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };
