import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu } from '@/components/ui/navigationmenu';
const meta: Meta<typeof NavigationMenu> = { title: 'UI/NavigationMenu', component: NavigationMenu, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof NavigationMenu>;
export const Default: Story = { args: {} };
