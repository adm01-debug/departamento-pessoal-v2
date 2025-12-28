import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@/components/ui/radio';
const meta: Meta<typeof Radio> = { title: 'UI/Radio', component: Radio, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Radio>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
