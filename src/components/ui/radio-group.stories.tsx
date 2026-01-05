import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
const meta: Meta<typeof RadioGroup> = { title: 'UI/RadioGroup', component: RadioGroup, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof RadioGroup>;
export const Default: Story = { render: () => <RadioGroup defaultValue="option1"><div className="flex items-center space-x-2"><RadioGroupItem value="option1" id="r1" /><Label htmlFor="r1">Opção 1</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="option2" id="r2" /><Label htmlFor="r2">Opção 2</Label></div></RadioGroup> };
