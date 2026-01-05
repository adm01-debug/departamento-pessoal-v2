import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
const meta: Meta<typeof Select> = { title: 'UI/Select', component: Select, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Select>;
export const Default: Story = { render: () => <Select><SelectTrigger className="w-[200px]"><SelectValue placeholder="Selecione..." /></SelectTrigger><SelectContent><SelectItem value="1">Opção 1</SelectItem><SelectItem value="2">Opção 2</SelectItem><SelectItem value="3">Opção 3</SelectItem></SelectContent></Select> };
