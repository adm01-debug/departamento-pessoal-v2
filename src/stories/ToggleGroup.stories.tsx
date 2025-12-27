import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
const meta: Meta<typeof ToggleGroup> = { title: 'UI/ToggleGroup', component: ToggleGroup };
export default meta;
type Story = StoryObj<typeof ToggleGroup>;
export const Default: Story = { render: () => <ToggleGroup type="single"><ToggleGroupItem value="a">A</ToggleGroupItem><ToggleGroupItem value="b">B</ToggleGroupItem></ToggleGroup> };
