import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';
const meta: Meta<typeof NavigationMenu> = { title: 'UI/NavigationMenu', component: NavigationMenu };
export default meta;
type Story = StoryObj<typeof NavigationMenu>;
export const Default: Story = { render: () => <NavigationMenu><NavigationMenuList><NavigationMenuItem><NavigationMenuLink href="/">Home</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu> };
