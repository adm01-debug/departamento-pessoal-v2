// V20-ST006: Pagination Story
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Components/Pagination", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Default: Story = { args: {} };
export const WithData: Story = { args: { data: [] } };
export const Loading: Story = { args: { loading: true } };
