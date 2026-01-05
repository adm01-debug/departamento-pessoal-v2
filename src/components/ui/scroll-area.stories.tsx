import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
const meta: Meta<typeof ScrollArea> = { title: 'UI/ScrollArea', component: ScrollArea, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ScrollArea>;
export const Default: Story = { render: () => <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">{Array.from({ length: 50 }).map((_, i) => <div key={i} className="py-1">Item {i + 1}</div>)}</ScrollArea> };
