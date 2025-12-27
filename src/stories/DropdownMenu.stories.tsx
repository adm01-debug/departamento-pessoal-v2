import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
const meta: Meta<typeof DropdownMenu> = { title: 'UI/DropdownMenu', component: DropdownMenu };
export default meta;
type Story = StoryObj<typeof DropdownMenu>;
export const Default: Story = { render: () => <DropdownMenu><DropdownMenuTrigger>Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Item 1</DropdownMenuItem></DropdownMenuContent></DropdownMenu> };
