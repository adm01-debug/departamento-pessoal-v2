import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "@/components/ui/Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/UI/Tabs",
  component: Tabs,
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

export const Default: Story = { args: { children: "Tabs Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Tabs Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Tabs Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Tabs Small" } };
export const Large: Story = { args: { size: "lg", children: "Tabs Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Tabs Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Tabs Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
