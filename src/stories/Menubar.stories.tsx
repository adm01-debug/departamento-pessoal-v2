import type { Meta, StoryObj } from '@storybook/react';
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@/components/ui/menubar';
const meta: Meta<typeof Menubar> = { title: 'UI/Menubar', component: Menubar };
export default meta;
type Story = StoryObj<typeof Menubar>;
export const Default: Story = { render: () => <Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New</MenubarItem></MenubarContent></MenubarMenu></Menubar> };
