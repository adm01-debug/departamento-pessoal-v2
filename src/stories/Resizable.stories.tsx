import type { Meta, StoryObj } from '@storybook/react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
const meta: Meta<typeof ResizablePanelGroup> = { title: 'UI/Resizable', component: ResizablePanelGroup };
export default meta;
type Story = StoryObj<typeof ResizablePanelGroup>;
export const Default: Story = { render: () => <ResizablePanelGroup direction="horizontal"><ResizablePanel>Painel 1</ResizablePanel><ResizableHandle /><ResizablePanel>Painel 2</ResizablePanel></ResizablePanelGroup> };
