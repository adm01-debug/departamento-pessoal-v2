import type { Meta, StoryObj } from "@storybook/react";
import { FileUpload } from "./FileUpload";
const meta: Meta<typeof FileUpload> = { title: "Forms/FileUpload", component: FileUpload };
export default meta;
type Story = StoryObj<typeof FileUpload>;
export const Default: Story = { args: {} };
export const Images: Story = { args: { accept: "image/*" } };
export const Multiple: Story = { args: { multiple: true } };
