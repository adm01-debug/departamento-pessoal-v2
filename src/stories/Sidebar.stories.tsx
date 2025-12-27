import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
const meta: Meta<typeof Sidebar> = { title: 'UI/Sidebar', component: Sidebar };
export default meta;
type Story = StoryObj<typeof Sidebar>;
export const Default: Story = { render: () => <Sidebar><SidebarHeader>Logo</SidebarHeader><SidebarContent><SidebarMenu><SidebarMenuItem>Item 1</SidebarMenuItem></SidebarMenu></SidebarContent></Sidebar> };
