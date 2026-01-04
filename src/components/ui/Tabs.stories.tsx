import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
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

export const Default: Story = { args: { children: "Tabs Component" } };
export const Primary: Story = { args: { children: "Tabs Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Tabs Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Tabs Small", size: "sm" } };
export const Large: Story = { args: { children: "Tabs Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Tabs Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Tabs Loading", loading: true } };
