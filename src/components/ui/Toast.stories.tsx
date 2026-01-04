import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
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

export const Default: Story = { args: { children: "Toast Component" } };
export const Primary: Story = { args: { children: "Toast Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Toast Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Toast Small", size: "sm" } };
export const Large: Story = { args: { children: "Toast Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Toast Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Toast Loading", loading: true } };
