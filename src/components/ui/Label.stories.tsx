import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Components/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Label" } };
export const WithVariants: Story = { args: { children: "Label Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Label", size: "sm" } };
export const Large: Story = { args: { children: "Label", size: "lg" } };
