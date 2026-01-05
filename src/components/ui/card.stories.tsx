import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
const meta: Meta<typeof Card> = { title: 'UI/Card', component: Card, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Card>;
export const Default: Story = { render: () => <Card className="w-[350px]"><CardHeader><CardTitle>Card Title</CardTitle><CardDescription>Card description goes here</CardDescription></CardHeader><CardContent><p>Card content</p></CardContent><CardFooter><Button>Action</Button></CardFooter></Card> };
export const Simple: Story = { render: () => <Card className="p-6"><p>Simple card with padding</p></Card> };
export const WithStats: Story = { render: () => <Card className="w-[200px]"><CardHeader className="pb-2"><CardTitle className="text-sm">Total</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">1,234</p></CardContent></Card> };
