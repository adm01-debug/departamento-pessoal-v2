import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP } from '@/components/ui/inputotp';
const meta: Meta<typeof InputOTP> = { title: 'UI/InputOTP', component: InputOTP, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof InputOTP>;
export const Default: Story = { args: {} };
