import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "ContextMenu" } };
export const WithVariants: Story = { args: { children: "ContextMenu Variant", variant: "primary" } };
export const Small: Story = { args: { children: "ContextMenu", size: "sm" } };
export const Large: Story = { args: { children: "ContextMenu", size: "lg" } };
