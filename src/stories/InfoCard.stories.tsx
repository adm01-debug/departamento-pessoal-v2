import type { Meta, StoryObj } from "@storybook/react";
import { InfoCard } from "@/components/InfoCard";

const meta: Meta<typeof InfoCard> = {
  title: "Components/InfoCard",
  component: InfoCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const WithData: Story = { args: { data: { title: "Sample", description: "Sample description" } } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = { args: { error: "Something went wrong" } };
export const Empty: Story = { args: { data: null } };
export const Compact: Story = { args: { variant: "compact" } };
export const Expanded: Story = { args: { variant: "expanded" } };
export const Mobile: Story = { parameters: { viewport: { defaultViewport: "mobile1" } } };
export const Tablet: Story = { parameters: { viewport: { defaultViewport: "tablet" } } };
export const Desktop: Story = { parameters: { viewport: { defaultViewport: "desktop" } } };
