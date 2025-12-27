import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
const meta: Meta<typeof AspectRatio> = { title: 'UI/AspectRatio', component: AspectRatio };
export default meta;
type Story = StoryObj<typeof AspectRatio>;
export const Default: Story = { render: () => <AspectRatio ratio={16/9}><div className="bg-slate-200 w-full h-full" /></AspectRatio> };
