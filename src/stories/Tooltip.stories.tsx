import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "@/components/ui/Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Components/UI/Tooltip",
  component: Tooltip,
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

export const Default: Story = { args: { children: "Tooltip Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Tooltip Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Tooltip Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Tooltip Small" } };
export const Large: Story = { args: { size: "lg", children: "Tooltip Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Tooltip Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Tooltip Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
