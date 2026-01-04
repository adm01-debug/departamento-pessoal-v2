import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Calendar" } };
export const WithVariants: Story = { args: { children: "Calendar Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Calendar", size: "sm" } };
export const Large: Story = { args: { children: "Calendar", size: "lg" } };
