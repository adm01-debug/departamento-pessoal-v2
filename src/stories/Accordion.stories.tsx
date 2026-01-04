import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "@/components/ui/Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/UI/Accordion",
  component: Accordion,
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

export const Default: Story = { args: { children: "Accordion Default" } };
export const Primary: Story = { args: { variant: "primary", children: "Accordion Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "Accordion Secondary" } };
export const Small: Story = { args: { size: "sm", children: "Accordion Small" } };
export const Large: Story = { args: { size: "lg", children: "Accordion Large" } };
export const Disabled: Story = { args: { disabled: true, children: "Accordion Disabled" } };
export const Loading: Story = { args: { loading: true, children: "Accordion Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
