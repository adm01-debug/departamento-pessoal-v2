import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "DatePicker" } };
export const WithVariants: Story = { args: { children: "DatePicker Variant", variant: "primary" } };
export const Small: Story = { args: { children: "DatePicker", size: "sm" } };
export const Large: Story = { args: { children: "DatePicker", size: "lg" } };
