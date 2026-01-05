import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
const meta: Meta<typeof Tabs> = { title: 'UI/Tabs', component: Tabs, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tabs>;
export const Default: Story = { render: () => <Tabs defaultValue="tab1" className="w-[400px]"><TabsList><TabsTrigger value="tab1">Tab 1</TabsTrigger><TabsTrigger value="tab2">Tab 2</TabsTrigger></TabsList><TabsContent value="tab1">Conteúdo da Tab 1</TabsContent><TabsContent value="tab2">Conteúdo da Tab 2</TabsContent></Tabs> };
