import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './dropdown-menu';
import { Button } from './button';
import { MoreHorizontal, Edit, Trash2, Copy } from 'lucide-react';
const meta: Meta<typeof DropdownMenu> = { title: 'UI/DropdownMenu', component: DropdownMenu, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DropdownMenu>;
export const Default: Story = { render: () => <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem><Edit className="w-4 h-4 mr-2" />Editar</DropdownMenuItem><DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Duplicar</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" />Excluir</DropdownMenuItem></DropdownMenuContent></DropdownMenu> };
