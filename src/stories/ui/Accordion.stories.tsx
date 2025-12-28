import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@/components/ui/accordion';
const meta: Meta<typeof Accordion> = { title: 'UI/Accordion', component: Accordion, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Accordion>;
export const Default: Story = { args: {} };
