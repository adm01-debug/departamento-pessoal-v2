import type { Meta, StoryObj } from "@storybook/react";
import { Command } from "./Command";

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Command" } };
export const WithVariants: Story = { args: { children: "Command Variant", variant: "primary" } };
export const Small: Story = { args: { children: "Command", size: "sm" } };
export const Large: Story = { args: { children: "Command", size: "lg" } };
