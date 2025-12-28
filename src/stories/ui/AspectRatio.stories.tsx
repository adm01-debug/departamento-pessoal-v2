import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@/components/ui/aspectratio';
const meta: Meta<typeof AspectRatio> = { title: 'UI/AspectRatio', component: AspectRatio, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof AspectRatio>;
export const Default: Story = { args: {} };
