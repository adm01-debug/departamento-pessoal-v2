import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@/components/ui/Switch";

const meta: Meta<typeof Switch> = {
  title: "Components/UI/Switch",
  component: Switch,
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

export const Default: Story = { args: { children: "Switch Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Switch Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Switch Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Switch Small" } };
export const Large: Story = { args: { size: "lg", children: "Switch Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Switch Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Switch Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
