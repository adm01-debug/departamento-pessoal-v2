import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const meta: Meta<typeof Tabs> = { title: 'UI/Tabs', component: Tabs, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = { render: () => (<Tabs defaultValue="tab1"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger><TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Content 1</TabsContent><TabsContent value="tab2">Content 2</TabsContent></Tabs>) };
