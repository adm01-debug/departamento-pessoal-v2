import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from '@/components/ui/datatable';
const meta: Meta<typeof DataTable> = { title: 'UI/DataTable', component: DataTable, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DataTable>;
export const Default: Story = { args: {} };
