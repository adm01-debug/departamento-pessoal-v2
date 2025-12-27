import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = { title: 'UI/Button', component: Button, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: 'Button' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };
export const Loading: Story = { args: { children: 'Loading...', disabled: true } };
