import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "@/components/ui/Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/UI/Toast",
  component: Toast,
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

export const Default: Story = { args: { children: "Toast Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Toast Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Toast Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Toast Small" } };
export const Large: Story = { args: { size: "lg", children: "Toast Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Toast Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Toast Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
