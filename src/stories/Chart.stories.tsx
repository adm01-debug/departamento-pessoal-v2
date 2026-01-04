import type { Meta, StoryObj } from "@storybook/react";
import { Chart } from "@/components/ui/Chart";

const meta: Meta<typeof Chart> = {
  title: "Components/UI/Chart",
  component: Chart,
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

export const Default: Story = { args: { children: "Chart Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Chart Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Chart Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Chart Small" } };
export const Large: Story = { args: { size: "lg", children: "Chart Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Chart Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Chart Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
