import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
const meta: Meta<typeof Tooltip> = { title: 'UI/Tooltip', component: Tooltip };
export default meta;
type Story = StoryObj<typeof Tooltip>;
export const Default: Story = { render: () => <TooltipProvider><Tooltip><TooltipTrigger>Hover</TooltipTrigger><TooltipContent>Dica</TooltipContent></Tooltip></TooltipProvider> };
