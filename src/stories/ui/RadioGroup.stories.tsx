import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '@/components/ui/radiogroup';
const meta: Meta<typeof RadioGroup> = { title: 'UI/RadioGroup', component: RadioGroup, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof RadioGroup>;
export const Default: Story = { args: {} };
