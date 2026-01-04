import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@/components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "Components/UI/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["default", "primary", "secondary", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Card Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Card Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Card Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Card Small" } };
export const Large: Story = { args: { size: "lg", children: "Card Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Card Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Card Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
