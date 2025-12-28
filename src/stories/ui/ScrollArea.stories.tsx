import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from '@/components/ui/scrollarea';
const meta: Meta<typeof ScrollArea> = { title: 'UI/ScrollArea', component: ScrollArea, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ScrollArea>;
export const Default: Story = { args: {} };
