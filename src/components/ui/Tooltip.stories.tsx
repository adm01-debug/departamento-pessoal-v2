import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Tooltip" } };
export const WithVariants: Story = { args: { children: "Tooltip Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Tooltip", size: "sm" } };
export const Large: Story = { args: { children: "Tooltip", size: "lg" } };
