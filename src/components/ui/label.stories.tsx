import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
const meta: Meta<typeof Label> = { title: 'UI/Label', component: Label, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Label>;
export const Default: Story = { args: { children: 'Email' } };
export const WithInput: Story = { render: () => <div className="grid w-full max-w-sm gap-1.5"><Label htmlFor="email">Email</Label><Input type="email" id="email" placeholder="email@exemplo.com" /></div> };
export const Required: Story = { render: () => <Label>Nome <span className="text-red-500">*</span></Label> };
