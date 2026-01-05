import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';
const meta: Meta<typeof Skeleton> = { title: 'UI/Skeleton', component: Skeleton, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Skeleton>;
export const Default: Story = { args: { className: 'h-4 w-[250px]' } };
export const Circle: Story = { args: { className: 'h-12 w-12 rounded-full' } };
export const Card: Story = { render: () => <div className="space-y-3"><Skeleton className="h-[200px] w-full rounded-lg" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div> };
export const TableRow: Story = { render: () => <div className="flex gap-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2 flex-1"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div></div> };
