import type { Meta, StoryObj } from '@storybook/react';
import { SelectPrimitive } from '@/components/ui/selectprimitive';
const meta: Meta<typeof SelectPrimitive> = { title: 'UI/SelectPrimitive', component: SelectPrimitive, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof SelectPrimitive>;
export const Default: Story = { args: {} };
