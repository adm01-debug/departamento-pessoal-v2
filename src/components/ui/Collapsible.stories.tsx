import type { Meta, StoryObj } from "@storybook/react";
import { Collapsible } from "./Collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Collapsible" } };
export const WithVariants: Story = { args: { children: "Collapsible Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Collapsible", size: "sm" } };
export const Large: Story = { args: { children: "Collapsible", size: "lg" } };
