import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '@/components/ui/pagination';
const meta: Meta<typeof Pagination> = { title: 'UI/Pagination', component: Pagination, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Pagination>;
export const Default: Story = { args: {} };
