import type { Meta, StoryObj } from "@storybook/react";
import { AlertCard } from "./AlertCard";

const meta: Meta<typeof AlertCard> = {
  title: "Components/AlertCard",
  component: AlertCard,
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

export const Default: Story = { args: { children: "AlertCard Component" } };
export const Primary: Story = { args: { children: "AlertCard Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "AlertCard Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "AlertCard Small", size: "sm" } };
export const Large: Story = { args: { children: "AlertCard Large", size: "lg" } };
export const Disabled: Story = { args: { children: "AlertCard Disabled", disabled: true } };
export const Loading: Story = { args: { children: "AlertCard Loading", loading: true } };
