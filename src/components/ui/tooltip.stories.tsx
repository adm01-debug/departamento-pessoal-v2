import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Button } from './button';
import { HelpCircle } from 'lucide-react';
const meta: Meta<typeof Tooltip> = { title: 'UI/Tooltip', component: Tooltip, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tooltip>;
export const Default: Story = { render: () => <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline"><HelpCircle className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Texto de ajuda</p></TooltipContent></Tooltip></TooltipProvider> };
