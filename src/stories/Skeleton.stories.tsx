import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@/components/ui/skeleton';

const meta: Meta<typeof Skeleton> = { title: 'UI/Skeleton', component: Skeleton, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = { render: () => <Skeleton className="h-4 w-48" /> };
export const Circle: Story = { render: () => <Skeleton className="h-12 w-12 rounded-full" /> };
export const Card: Story = { render: () => (<div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>) };
