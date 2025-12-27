import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
const meta: Meta<typeof Popover> = { title: 'UI/Popover', component: Popover };
export default meta;
type Story = StoryObj<typeof Popover>;
export const Default: Story = { render: () => <Popover><PopoverTrigger>Open</PopoverTrigger><PopoverContent>Content</PopoverContent></Popover> };
