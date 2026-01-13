// V20-ST003: FileUpload Story
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Components/FileUpload", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Default: Story = { args: {} };
export const WithData: Story = { args: { data: [] } };
export const Loading: Story = { args: { loading: true } };
