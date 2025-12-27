import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
const meta: Meta<typeof RadioGroup> = { title: 'UI/RadioGroup', component: RadioGroup };
export default meta;
type Story = StoryObj<typeof RadioGroup>;
export const Default: Story = { render: () => <RadioGroup defaultValue="1"><RadioGroupItem value="1" />Opção 1<RadioGroupItem value="2" />Opção 2</RadioGroup> };
