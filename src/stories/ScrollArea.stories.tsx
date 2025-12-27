import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scroll-area';
const meta: Meta<typeof ScrollArea> = { title: 'UI/ScrollArea', component: ScrollArea };
export default meta;
type Story = StoryObj<typeof ScrollArea>;
export const Default: Story = { render: () => <ScrollArea className="h-48 w-48 rounded border"><div className="p-4">{Array(50).fill(0).map((_, i) => <p key={i}>Item {i+1}</p>)}</div></ScrollArea> };
