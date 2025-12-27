import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
const meta: Meta<typeof Drawer> = { title: 'UI/Drawer', component: Drawer };
export default meta;
type Story = StoryObj<typeof Drawer>;
export const Default: Story = { render: () => <Drawer><DrawerTrigger>Abrir</DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Drawer</DrawerTitle></DrawerHeader></DrawerContent></Drawer> };
