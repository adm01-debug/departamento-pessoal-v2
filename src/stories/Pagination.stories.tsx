import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
const meta: Meta<typeof Pagination> = { title: 'UI/Pagination', component: Pagination };
export default meta;
type Story = StoryObj<typeof Pagination>;
export const Default: Story = { render: () => <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" /></PaginationItem><PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem><PaginationItem><PaginationNext href="#" /></PaginationItem></PaginationContent></Pagination> };
