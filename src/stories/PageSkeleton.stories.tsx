import type { Meta, StoryObj } from '@storybook/react';
import { PageSkeleton } from '@/components/skeleton/PageSkeleton';
const meta: Meta<typeof PageSkeleton> = { title: 'Skeleton/PageSkeleton', component: PageSkeleton };
export default meta;
type Story = StoryObj<typeof PageSkeleton>;
export const Default: Story = {};
export const WithHeader: Story = { args: { showHeader: true } };
