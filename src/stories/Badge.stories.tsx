import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/UI/Badge",
  component: Badge,
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

export const Default: Story = { args: { children: "Badge Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Badge Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Badge Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Badge Small" } };
export const Large: Story = { args: { size: "lg", children: "Badge Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Badge Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Badge Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
