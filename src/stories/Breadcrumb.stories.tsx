import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
const meta: Meta<typeof Breadcrumb> = { title: 'UI/Breadcrumb', component: Breadcrumb };
export default meta;
type Story = StoryObj<typeof Breadcrumb>;
export const Default: Story = { render: () => <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbItem><BreadcrumbLink href="/users">Usuários</BreadcrumbLink></BreadcrumbItem></BreadcrumbList></Breadcrumb> };
