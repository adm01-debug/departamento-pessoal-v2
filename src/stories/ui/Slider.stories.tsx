import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/slider';
const meta: Meta<typeof Slider> = { title: 'UI/Slider', component: Slider, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Slider>;
export const Default: Story = { args: {} };
export const Variant: Story = { args: { variant: 'secondary' } };
