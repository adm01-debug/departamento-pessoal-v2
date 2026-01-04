import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@/components/ui/Alert";

const meta: Meta<typeof Alert> = {
  title: "Components/UI/Alert",
  component: Alert,
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

export const Default: Story = { args: { children: "Alert Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Alert Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Alert Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Alert Small" } };
export const Large: Story = { args: { size: "lg", children: "Alert Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Alert Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Alert Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
