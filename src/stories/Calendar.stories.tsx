import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "@/components/ui/Calendar";

const meta: Meta<typeof Calendar> = {
  title: "Components/UI/Calendar",
  component: Calendar,
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

export const Default: Story = { args: { children: "Calendar Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Calendar Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Calendar Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Calendar Small" } };
export const Large: Story = { args: { size: "lg", children: "Calendar Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Calendar Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Calendar Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
