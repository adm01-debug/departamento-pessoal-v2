import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from '@/components/ui/datepicker';
const meta: Meta<typeof DatePicker> = { title: 'UI/DatePicker', component: DatePicker, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof DatePicker>;
export const Default: Story = { args: {} };
