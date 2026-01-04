import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@/components/ui/Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/UI/Avatar",
  component: Avatar,
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

export const Default: Story = { args: { children: "Avatar Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Avatar Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Avatar Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Avatar Small" } };
export const Large: Story = { args: { size: "lg", children: "Avatar Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Avatar Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Avatar Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
