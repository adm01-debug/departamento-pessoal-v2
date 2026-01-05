import type { Meta, StoryObj } from "@storybook/react";
import { MoneyInput } from "./MoneyInput";
const meta: Meta<typeof MoneyInput> = { title: "Forms/MoneyInput", component: MoneyInput };
export default meta;
type Story = StoryObj<typeof MoneyInput>;
export const Default: Story = { args: { value: 0 } };
export const WithValue: Story = { args: { value: 5000.50 } };
export const USD: Story = { args: { value: 1000, currency: "US$" } };
