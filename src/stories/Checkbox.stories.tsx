import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/ui/Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/UI/Checkbox",
  component: Checkbox,
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

export const Default: Story = { args: { children: "Checkbox Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Checkbox Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Checkbox Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Checkbox Small" } };
export const Large: Story = { args: { size: "lg", children: "Checkbox Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Checkbox Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Checkbox Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
