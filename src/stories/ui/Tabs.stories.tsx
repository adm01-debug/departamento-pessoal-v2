import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@/components/ui/tabs';
const meta: Meta<typeof Tabs> = { title: 'UI/Tabs', component: Tabs, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Tabs>;
export const Default: Story = { args: {} };
