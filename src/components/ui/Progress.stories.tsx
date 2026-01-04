import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./Progress";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
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

export const Default: Story = { args: { children: "Progress Component" } };
export const Primary: Story = { args: { children: "Progress Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Progress Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Progress Small", size: "sm" } };
export const Large: Story = { args: { children: "Progress Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Progress Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Progress Loading", loading: true } };
