import type { Meta, StoryObj } from '@storybook/react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
const meta: Meta<typeof Form> = { title: 'UI/Form', component: Form };
export default meta;
type Story = StoryObj<typeof Form>;
export const Default: Story = { render: () => { const form = useForm(); return <Form {...form}><FormField name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /></Form>; } };
