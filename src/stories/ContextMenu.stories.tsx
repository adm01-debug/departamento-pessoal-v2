import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
const meta: Meta<typeof ContextMenu> = { title: 'UI/ContextMenu', component: ContextMenu };
export default meta;
type Story = StoryObj<typeof ContextMenu>;
export const Default: Story = { render: () => <ContextMenu><ContextMenuTrigger>Clique direito</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Opção 1</ContextMenuItem></ContextMenuContent></ContextMenu> };
