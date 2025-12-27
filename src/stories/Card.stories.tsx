import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Card> = { title: 'UI/Card', component: Card, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = { render: () => (<Card><CardHeader><CardTitle>Card Title</CardTitle><CardDescription>Card description</CardDescription></CardHeader><CardContent><p>Content goes here</p></CardContent><CardFooter><Button>Action</Button></CardFooter></Card>) };
