import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
const meta: Meta<typeof Accordion> = { title: 'UI/Accordion', component: Accordion };
export default meta;
type Story = StoryObj<typeof Accordion>;
export const Default: Story = { render: () => <Accordion type="single" collapsible><AccordionItem value="item-1"><AccordionTrigger>Item 1</AccordionTrigger><AccordionContent>Conteúdo 1</AccordionContent></AccordionItem></Accordion> };
