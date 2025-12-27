import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
const meta: Meta<typeof Select> = { title: 'UI/Select', component: Select };
export default meta;
type Story = StoryObj<typeof Select>;
export const Default: Story = { render: () => <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="1">Opção 1</SelectItem></SelectContent></Select> };
