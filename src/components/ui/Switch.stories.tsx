import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
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

export const Default: Story = { args: { children: "Switch Component" } };
export const Primary: Story = { args: { children: "Switch Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Switch Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Switch Small", size: "sm" } };
export const Large: Story = { args: { children: "Switch Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Switch Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Switch Loading", loading: true } };
