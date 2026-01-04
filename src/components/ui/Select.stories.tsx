import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
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

export const Default: Story = { args: { children: "Select Component" } };
export const Primary: Story = { args: { children: "Select Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Select Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Select Small", size: "sm" } };
export const Large: Story = { args: { children: "Select Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Select Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Select Loading", loading: true } };
