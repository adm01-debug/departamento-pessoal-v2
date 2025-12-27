import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const meta: Meta<typeof Avatar> = { title: 'UI/Avatar', component: Avatar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = { render: () => (<Avatar><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar>) };
export const Fallback: Story = { render: () => (<Avatar><AvatarFallback>JD</AvatarFallback></Avatar>) };
