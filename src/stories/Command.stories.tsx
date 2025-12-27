import type { Meta, StoryObj } from '@storybook/react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
const meta: Meta<typeof Command> = { title: 'UI/Command', component: Command };
export default meta;
type Story = StoryObj<typeof Command>;
export const Default: Story = { render: () => <Command><CommandInput placeholder="Buscar..." /><CommandList><CommandEmpty>Sem resultados</CommandEmpty><CommandGroup><CommandItem>Item 1</CommandItem></CommandGroup></CommandList></Command> };
