import type { Meta, StoryObj } from '@storybook/react';
import { Carousel } from '@/components/ui/carousel';
const meta: Meta<typeof Carousel> = { title: 'UI/Carousel', component: Carousel, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Carousel>;
export const Default: Story = { args: {} };
