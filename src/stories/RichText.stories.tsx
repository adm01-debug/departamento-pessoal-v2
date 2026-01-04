import type { Meta, StoryObj } from "@storybook/react";
import { RichText } from "@/components/ui/RichText";

const meta: Meta<typeof RichText> = {
  title: "Components/UI/RichText",
  component: RichText,
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

export const Default: Story = { args: { children: "RichText Default" } };
export const Primary: Story = { args: { variant: "primary", children: "RichText Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "RichText Secondary" } };
export const Small: Story = { args: { size: "sm", children: "RichText Small" } };
export const Large: Story = { args: { size: "lg", children: "RichText Large" } };
export const Disabled: Story = { args: { disabled: true, children: "RichText Disabled" } };
export const Loading: Story = { args: { loading: true, children: "RichText Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
