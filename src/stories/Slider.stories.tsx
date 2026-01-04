import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@/components/ui/Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/UI/Slider",
  component: Slider,
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

export const Default: Story = { args: { children: "Slider Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Slider Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Slider Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Slider Small" } };
export const Large: Story = { args: { size: "lg", children: "Slider Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Slider Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Slider Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
