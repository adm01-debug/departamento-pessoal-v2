import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from '@/components/ui/hovercard';
const meta: Meta<typeof HoverCard> = { title: 'UI/HoverCard', component: HoverCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof HoverCard>;
export const Default: Story = { args: {} };
