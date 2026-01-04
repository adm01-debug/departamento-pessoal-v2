import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
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

export const Default: Story = { args: { children: "Card Component" } };
export const Primary: Story = { args: { children: "Card Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Card Secondary", variant: "secondary" } };
export const Small: Story = { args: { children: "Card Small", size: "sm" } };
export const Large: Story = { args: { children: "Card Large", size: "lg" } };
export const Disabled: Story = { args: { children: "Card Disabled", disabled: true } };
export const Loading: Story = { args: { children: "Card Loading", loading: true } };
