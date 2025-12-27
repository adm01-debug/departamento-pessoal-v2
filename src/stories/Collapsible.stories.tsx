import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
const meta: Meta<typeof Collapsible> = { title: 'UI/Collapsible', component: Collapsible };
export default meta;
type Story = StoryObj<typeof Collapsible>;
export const Default: Story = { render: () => <Collapsible><CollapsibleTrigger>Toggle</CollapsibleTrigger><CollapsibleContent>Conteúdo oculto</CollapsibleContent></Collapsible> };
