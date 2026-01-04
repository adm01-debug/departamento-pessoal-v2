import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Badge Component" } };
export const Primary: Story = { args: { children: "Badge Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Badge Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Badge Small", size: "sm" } };
export const Large: Story = { args: { children: "Badge Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Badge Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Badge Loading", loading: true } };
