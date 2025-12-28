import type { Meta, StoryObj } from '@storybook/react';
import { Resizable } from '@/components/ui/resizable';
const meta: Meta<typeof Resizable> = { title: 'UI/Resizable', component: Resizable, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Resizable>;
export const Default: Story = { args: {} };
