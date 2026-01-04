import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "@/components/ui/FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Components/UI/FileUpload",
  component: FileUpload,
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

export const Default: Story = { args: { children: "FileUpload Default" } };
export const Primary: Story = { args: { variant: "primary", children: "FileUpload Primary" } };
export const Secondary: Story = { args: { variant: "secondary", children: "FileUpload Secondary" } };
export const Small: Story = { args: { size: "sm", children: "FileUpload Small" } };
export const Large: Story = { args: { size: "lg", children: "FileUpload Large" } };
export const Disabled: Story = { args: { disabled: true, children: "FileUpload Disabled" } };
export const Loading: Story = { args: { loading: true, children: "FileUpload Loading" } };
export const WithIcon: Story = { args: { children: "With Icon", icon: "check" } };
export const FullWidth: Story = { args: { className: "w-full", children: "Full Width" } };
export const CustomStyle: Story = { args: { className: "bg-gradient-to-r from-blue-500 to-purple-500", children: "Custom" } };
