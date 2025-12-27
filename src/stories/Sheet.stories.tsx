import type { Meta, StoryObj } from '@storybook/react';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
const meta: Meta<typeof Sheet> = { title: 'UI/Sheet', component: Sheet };
export default meta;
type Story = StoryObj<typeof Sheet>;
export const Default: Story = { render: () => <Sheet><SheetTrigger>Abrir</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Sheet</SheetTitle></SheetHeader></SheetContent></Sheet> };
