import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "@/components/ui/Popover";

const meta: Meta<typeof Popover> = {
  title: "Components/UI/Popover",
  component: Popover,
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

export const Default: Story = { args: { children: "Popover Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Popover Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Popover Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Popover Small" } };
export const Large: Story = { args: { size: "lg", children: "Popover Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Popover Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Popover Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
