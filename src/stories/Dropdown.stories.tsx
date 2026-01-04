import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown } from "@/components/ui/Dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "Components/UI/Dropdown",
  component: Dropdown,
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

export const Default: Story = { args: { children: "Dropdown Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Dropdown Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Dropdown Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Dropdown Small" } };
export const Large: Story = { args: { size: "lg", children: "Dropdown Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Dropdown Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Dropdown Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
