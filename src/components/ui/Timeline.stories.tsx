// V20-ST008: Timeline Story
import type { Meta, StoryObj } from "@storybook/react";
const meta: Meta = { title: "Components/Timeline", tags: ["autodocs"] };
export default meta;
type Story = StoryObj;
export const Default: Story = { args: {} };
export const WithData: Story = { args: { data: [] } };
export const Loading: Story = { args: { loading: true } };
