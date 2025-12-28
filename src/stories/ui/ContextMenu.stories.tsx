import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from '@/components/ui/contextmenu';
const meta: Meta<typeof ContextMenu> = { title: 'UI/ContextMenu', component: ContextMenu, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof ContextMenu>;
export const Default: Story = { args: {} };
