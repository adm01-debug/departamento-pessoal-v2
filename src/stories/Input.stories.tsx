import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/Input";

const meta: Meta<typeof Input> = {
  title: "Components/UI/Input",
  component: Input,
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

export const Default: Story = { args: { children: "Input Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Input Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Input Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Input Small" } };
export const Large: Story = { args: { size: "lg", children: "Input Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Input Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Input Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
