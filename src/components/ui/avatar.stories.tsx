import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
const meta: Meta<typeof Avatar> = { title: 'UI/Avatar', component: Avatar, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Avatar>;
export const WithImage: Story = { render: () => <Avatar><AvatarImage src="https://github.com/shadcn.png" /><AvatarFallback>CN</AvatarFallback></Avatar> };
export const Fallback: Story = { render: () => <Avatar><AvatarFallback>JS</AvatarFallback></Avatar> };
export const Sizes: Story = { render: () => <div className="flex gap-2 items-center"><Avatar className="h-8 w-8"><AvatarFallback>SM</AvatarFallback></Avatar><Avatar><AvatarFallback>MD</AvatarFallback></Avatar><Avatar className="h-16 w-16"><AvatarFallback>LG</AvatarFallback></Avatar></div> };
