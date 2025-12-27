import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
const meta: Meta<typeof HoverCard> = { title: 'UI/HoverCard', component: HoverCard };
export default meta;
type Story = StoryObj<typeof HoverCard>;
export const Default: Story = { render: () => <HoverCard><HoverCardTrigger>Hover aqui</HoverCardTrigger><HoverCardContent>Conteúdo do hover</HoverCardContent></HoverCard> };
